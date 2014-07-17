class AddMoipStatusAndMoipCodeOnOrders < ActiveRecord::Migration
  def change
    change_table :spree_orders do |t|
      t.string :moip_status
      t.string :moip_code
    end
  end
end
