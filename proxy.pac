function FindProxyForURL(url, host) {

	if (shExpMatch(host, "db.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "i.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "s.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "m.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "saa.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "iploc.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "dealer.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "ask.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "jiangjia.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "fans.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "beijing.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "beijingchezhan.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "mobile.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "tousu.auto.sohu.com")) {
        return 'DIRECT';
    }
	if (shExpMatch(host, "tehui.auto.sohu.com")) {
        return 'DIRECT';
    }	
	if (shExpMatch(host, "goche.auto.sohu.com")) {
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