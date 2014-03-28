FactoryGirl.define do
  factory :moip_payment_method, class: Spree::PaymentMethod::Moip do |record|
    record.name 'Moip'
    record.environment 'test'
  end
end
