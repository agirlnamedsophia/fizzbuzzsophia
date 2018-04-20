As an SRE, I've discovered that most of what I do at work is read and write and refactor YAML.

YAML-based configuration isn't a new concept. It's simple, easy to read (as a human), easy to write, and easy to load and parse. Data serialization is not an easy thing to manage, however, and YAML comes with its own set of complex problems to solve (mostly around security).

Any object in Ruby can be serialized into YAML. I'm currently working on a project where we need to create really big configuration files in YAML, so automating that process in Ruby made sense. Calling `to_yaml` and `YAML.safe_load` and `YAML.dump` with various inputs has surprised me with occasionally unexpected outputs. I've often expected a one dimensional object and I want to add it to an array but then really the object is giving me an array itself! Sometimes I want my final output to be a one-dimensional array but I've added so many other YAML-loaded and dumped strings to it who knows how nested it's gotten. Sometimes I want my output to be _exactly what I wrote_ and not to be broken up in multiple lines. So here is some stuff I've found along the way.

### multi-line strings!

I've discovered that when you convert multi-line strings to YAML, they have the traditional 80-character line break. In order to get around it, you have to add a `line_width` attribute

    def string
      YAML.safe_load(<<~YAML)
        - name:
            command: |
              I am a multiline command and I am a string that is longer than 80 characters because why not I have something to say
      YAML
    end

    irb(main):011:0> string
    # I'm an array!
    => [{"name"=>{"command"=>"I am a multiline command and I am a string that is longer than 80 characters because why not I have something to say\n"}}]

    irb(main):012:0> string.to_yaml
    # I'm a YAML array!
    => "---\n- name:\n    command: 'I am a multiline command and I am a string that is longer than 80 characters\n      because why not I have something to say\n\n'\n"

What's going on? I didn't want a line break there!

So you can do something like this, if you want:

    string.to_yaml(line_width: -1)
    => "---\n- name:\n    command: 'I am a multiline command and I am a string that is longer than 80 characters because why not I have something to say\n\n'\n"

I doubt you want to have `(line_width: -1)` everywhere in your code. You can monkeypatch `Object#to_yaml` (which would probably have unintended side effects down the line)

    class Object

    def to_yaml options = {}
      Psych.dump self, options.merge(line_width: -1)
    end

Or you can craft a `YamlHelper` to do the dirty work for you.

    class YamlHelper
      def to_custom_yaml
        to_yaml.merge(line_width: -1)
      end
    end

Or you could just give up and accept YAML line breaks because the YAML will still be parsed as you expected. It just might make writing unit tests a little annoying because you have to run the test, let it fail, and insert the line break at the 80-character mark where the test has informed you, it found a line-break.

### `#safe_load`!

Also, why am I using `safe_load`? It's because serialization is hard. This comes from a bug originally found in Rails 3, I think, regarding unsafe serialization if you ran `YAML.load(input)` and `input` was something you didn't necessarily control (user input, for example). Now the core library includes `#safe_load` but you can also use the [safe_yaml gem](https://github.com/dtao/safe_yaml) which handles this safe serialization with a little bit of configuration. The readme of this gem tells you pretty much everything you need to know, but the point is that if you were to just run `YAML.load(input)` and the `input` was a string that contained words which, once serialized, executed arbitrary code against your system, you'd be in trouble.

### arrays! and hashes!

This might seem just common YAML sense but when you're crafting YAML inside Ruby, you might forget about it.

Say I want to add a series of arbitrary strings to an array in YAML, but all of these strings and arrays need to be dynamically generated. I don't want to write out all that YAML by hand! (otherwise my plan to dominate these giant YAML configuration files with magical ruby automation will have been thwarted)

So say I have this class

    class Party
      attr_reader :snacks

      def initialize
        @snacks = []
      end

      def add_snack(snack)
        snacks << snack
      end
    end

and I want to add some snacks to my party

    class CheesePlate
      def to_s
        YAML.safe_load(<<~YAML)
          name: chz plate
          ingredients: |
            - camembert
            - brie
        YAML
      end
    end

    class MeatAndVeggiePlate
      def to_s
        YAML.safe_load(<<~YAML)
          - name: meat plate
            ingredients: |
              - pâté
              - saucisson
          - name: veggie plate
            ingredients: |
              - carrots
              - cucumbers
        YAML
      end

And so I ask the party planner to figure out the snacks situation

    party = Party.new

    [CheesePlate.new.to_s, MeatAndVeggiePlate.new.to_s].each do |snack|
      party.add_snack(snack)
    end

What will I get?

    party.snacks
    => [{"name"=>"chz plate", "ingredients"=>"- camembert\n- brie\n"}, [{"name"=>"meat plate", "ingredients"=>"- pâté\n- saucisson\n"}, {"name"=>"veggie plate", "ingredients"=>"- carrots\n- cucumbers\n"}]]

Hmmm, that looks like a nested array. I can't tell what's on the menu that way.

    irb(main):087:0> party.snacks.map { |snack| snack["name"] }
    TypeError: no implicit conversion of String into Integer

Nooooooooo! Seems like I don't want to just shovel things into my `snacks`. (I mean, an obvious code smell is the fact that my `MeatAndVeggiePlate` should really be two objects, no vegetarian would allow such a coupling of flavors). But if I had a `DessertPlate` I can see `to_s` returning a pie, maybe a cake, and splitting those up into separate objects doesn't feel super useful in this domain. It's a little _too_ granular. So what do I do?


    def add_snack(snack)
      snacks.concat [snack].flatten
    end

    irb(main):125:0> party.snacks.map { |snack| snack["name"] }
    => ["chz plate", "meat plate", "veggie plate"]

**sigh** Yes please that sounds delicious. I wish there was dessert, though.
