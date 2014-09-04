Deface::Override.new(:virtual_path => "spree/shared/_order_details",
                     :name => "order_details_boleto",
                     #:insert_before => "[data-hook='order_details']",
                     :insert_before => "[class='row steps-data']",
                     :partial => "spree/shared/boleto_info")
