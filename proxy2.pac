function FindProxyForURL(url, host) {

	
	if (shExpMatch(host, "tehui.auto.sohu.com")) {
        return 'DIRECT';
    }

	if (shExpMatch(host, "*.auto.sohu.com")) {
        return 'PROXY 10.16.5.37:80';
    }
	
	if (shExpMatch(url, "http://m*.auto.itc.cn/car/theme/newdb/*")) {
        return 'PROXY 10.16.5.37:80';
    }
	
	if (shExpMatch(url, "http://m*.auto.itc.cn/car/theme/wapdb/*")) {
        return 'PROXY 10.16.5.37:80';
    }
	
	return 'DIRECT';
}