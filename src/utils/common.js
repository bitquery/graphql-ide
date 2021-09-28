export const generateLink = (type) => {
	let result           = type ? 's' : ''
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charactersLength = characters.length
	for ( let i = 0; i < 10; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result;
}

export const stringifyIncludesFunction = (key, value) => 
	typeof value === 'function' ? value.toString() : value

export const validEmail = (email) => {
	let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(email)
}
export const height_of = el => parseInt(window.getComputedStyle(el).height.replace(/px$/, ""))
export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  }
export const getValueFrom = (o, s) => {
    s = s.replace(/\[(\w+)\]/g, '.$1'); 
    s = s.replace(/^\./, '');           
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
export const getLeft = (initialElem) => {
	let pt = 0;
	let elem = initialElem;
	while (elem.offsetParent) {
	  pt += elem.offsetLeft;
	  elem = elem.offsetParent;
	}
	return pt;
}
export const getTop = (initialElem) => {
	let pt = 0;
	let elem = initialElem;
	while (elem.offsetParent) {
	  pt += elem.offsetTop;
	  elem = elem.offsetParent;
	}
	return pt;
}
export const makekey = () => {
	let result           = '';
	let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < 29; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return `BQY${result}`
  }
