
export const widgetCallbacks = {
        
        Property_value_path : {
			name: 'Property value path',
			check: (args, data_types) => Object.keys(data_types).some(type => type.includes('.address.address') || type.includes('block.height')),
			renderer: function(item){
				if (item.address && item.address.address!='0x0000000000000000000000000000000000000000' ) {
					return '<%= locale_path_prefix %><%= @network[:network] %>' + '/address/' + item.address.address;
				} else if (item.block ){
					return '<%= locale_path_prefix %><%= @network[:network] %>'+'/block/'+item.block.height;
				}else{
					return null;
				}
			}
        }
       
    
}