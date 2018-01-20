require 'rails_helper'

RSpec.describe Post do
  describe '.ordered' do
    it 'returns a list of Posts in order' do
      expect(Post.ordered.map(&:created_at)).to contain_exactly(
        'Sun, 07 Jan 2018'.to_date, 'Thu, 11 Jan 2018'.to_date
      )
    end
  end
end
