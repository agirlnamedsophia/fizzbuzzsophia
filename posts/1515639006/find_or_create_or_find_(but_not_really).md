I ran into this problem at work today. We were running our CI tests with parallelism, so for each glob of tests that failed a notification would be sent to the contributor(s) in Slack telling them that their code had problems. But we didn't want to notify them more than once if, say, 2 tests failed at the same time. That's obnoxious. Hello, alert fatigue!

The method we've been using most often in this project to evaluate state was to ask GitHub what the state of the commit was (we called this our "stateless" solution because we were delegating state to some other service). We would update the commit with different contexts using their status API and then when an event happened and we needed to make a decision about what to do next we'd inspect the commit before taking further action. But this time it felt like an unnecessary addition of yet another API call. If we went that route, one request to GitHub would wrap another request to GitHub — we would base the latter API call on the result of the previous call. That didn't feel good.

We'd also gone down the route of using an advisory lock to implement a mutually exclusive way of inspecting state and performing an action. But we opted not to do this because it felt cleaner to just use a database. I do like advisory locks though and will talk about them another time.

So we asked ourselves, why not just create a `CIBuildFailure` record and decide what to do based on the existence of it for a specific build number + repository?

We didn't care about fetching the record and asking it about itself — the presence of that record for a specific build number for a specific repository would be enough. We didn't want to retrieve it, we only wanted to know if it was created or, rather, if it already existed.

We opted not to use model validations because it made things more complicated with the way we were checking existence, and it was simpler to lean on database uniqueness constraints. And asking a database for a specific record with uniqueness constraints and indexing on those constraints is I think `log(n)`, so if 8 of the parallel specs fail we would have to make the query 8 times but that's a lot better than making 8 round trips to GitHub. Our database server is also probably a lot closer than GitHub's app servers. So, it's just faster.

```
class CIBuildFailure < ApplicationRecord

  def self.track!(build_number:, repository:)
    transaction(requires_new: true) do
      new(build_number: build_number, repository: repository).save!
    end
  rescue ActiveRecord::RecordNotUnique
    false
  end
end
```

What's happening here is I'm wrapping the object construction in a `transaction` so that whatever happens inside the block will be executed inside a database transaction, locking the row to ensure nothing else happens until the block succeeds or fails. Because of our database constraints, if `save!` fails to execute because an object has already been created we'll default to rescuing and return `false`. If the object saves we'll return `true`. This use of `transaction` is how we were able to handle the concurrency problem of multiple parallel job failures at once.

```
  def failed!
    if CIBuildFailure.track!(build_number: build_number, repository: repository)
      send_message_to_contributors!(message: message_for(status: :failed))
    else
      Rails.logger.info(<<~MSG)
        Skipping build failure notifications because build was already 
        processed (build_number: #{build_number}, repository: #{repository})"
      MSG
    end
  end
```

We can now call `#track!` in any other class that wants to prevent more than one build failure from having the same side effects, and handle success and failures however we want to. A class method on an object whose sole purpose is to handle the creation of a uniquely constrained record felt like an isolated, reusable and smarter way of handling `#find_or_create`, which is ostensibly what we were doing. We wanted to create the object but if we found one then we'd blow up, which is what we wanted since we didn't care about returning the object itself.

I could have written (and did at one point)

```
  class CIBuildFailure < ApplicationRecord
    validate :repository, uniqueness: { scope: :build_number }
  end

...

  def failed!
    CIBuildFailure.new(build_number: build_number, repository: repository).tap do |failure|
      if failure.save
        send_message_to_contributors!
      else
        Rails.logger.info("Message already sent")
      end
    end
  end
```

But this didn't solve the problem of concurrency. And it returned a record which we didn't care about.

I could have wrapped this whole block in a `transaction` but that felt messy and dishonest because I only wanted to wrap the record creation in a transaction, not the whole process. That could have unintended consequences of blocking processes if more than one test failed at a time. We decided this was the least intrusive and quickest way to ensure uniqueness, to provide a reusable interface to handle build failure events wherever they may occur, and to not annoy our engineers.
