class AddMoipPaymentIdToOrder < ActiveRecord::Migration
  def change
    change_table :spree_orders do |t|
      t.integer :moip_payment_id
    end
  end
end
