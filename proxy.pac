function FindProxyForURL(url, host) {

	if (shExpMatch(host, "(tehui|db).auto.sohu.com")) {
        return 'DIRECT';
    }
	
	if (shExpMatch(url, "http://(mp).auto.sohu.com/*")) {
        return 'PROXY 10.16.5.43:80';
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
	
    return 'DIRECT;';

}