class AddNewFieldsToSpeeMoipPayments < ActiveRecord::Migration
  def change
    change_table :spree_moip_payments do |t|
      t.string :moip_code
      t.string :status
    end
  end
end
