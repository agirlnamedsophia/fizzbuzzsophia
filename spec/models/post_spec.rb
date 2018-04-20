require 'rails_helper'

RSpec.describe Post do
  describe '.ordered' do
    let(:post_a) do
      instance_double Post, created_at: 'Sun, 07 Jan 2018'.to_date
    end
    let(:post_b) do
      instance_double Post, created_at: 'Thu, 11 Jan 2018'.to_date
    end

    before do
      allow(Post).to receive(:all).and_return [post_a, post_b]
    end

    it 'returns a list of Posts by recency' do
      expect(Post.by_recency.map(&:created_at)).to eq [
        'Sun, 07 Jan 2018'.to_date, 'Thu, 11 Jan 2018'.to_date
      ]
    end
  end
end
