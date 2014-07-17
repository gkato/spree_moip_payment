class RemoveColumnsFromSpreeMoipPayment < ActiveRecord::Migration
  def up
    remove_column :spree_moip_payments, :value
    remove_column :spree_moip_payments, :payment_status
    remove_column :spree_moip_payments, :moip_code
    remove_column :spree_moip_payments, :payment_type
    remove_column :spree_moip_payments, :customer_email
  end

  def down
    add_column :spree_moip_payments, :value, :decimal
    add_column :spree_moip_payments, :payment_status, :integer
    add_column :spree_moip_payments, :moip_code, :integer
    add_column :spree_moip_payments, :payment_type, :string
    add_column :spree_moip_payments, :customer_email, :string
  end
end
