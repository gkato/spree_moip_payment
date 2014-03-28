FactoryGirl.define do
  factory :moip_order, class: Spree::Order do |record|
    record.association(:user, factory: :user)
    record.shipments do
      [FactoryGirl.create(:moip_shipment)]
    end
    record.association(:bill_address, factory: :moip_address)
    record.association(:ship_address, factory: :moip_address)
    record.bill_address_id do |order|
      order.bill_address.id
    end
  end

  factory :moip_shipment, class: Spree::Shipment do |record|
    record.association(:address, factory: :moip_address)
    record.order Spree::Order.new
  end
end
