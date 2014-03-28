FactoryGirl.define do
  factory :rj_state, class: Spree::State do |record|
    record.name 'Rio de Janeiro'
    record.abbr 'RJ'
    record.country { |country| country.association(:country) }
  end
end
