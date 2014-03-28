Spree::Address.class_eval do

  #attr_accessible :address_number, :district

  validates :address_number, :district, presence: true
  validates :zipcode, :format => { :with => /\A(\d){5}-(\d){3}\z/ }
  validates :phone, :format => { :with => /\A\((\d){2}\)(\d){4}-(\d){4,5}\z/ }
end
