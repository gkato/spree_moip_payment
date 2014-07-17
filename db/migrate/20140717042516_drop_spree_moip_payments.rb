class DropSpreeMoipPayments < ActiveRecord::Migration
  def up
    drop_table :spree_moip_payments
  end
end
