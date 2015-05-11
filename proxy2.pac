function FindProxyForURL(url, host) {
	if (shExpMatch(url, "http://[^/]+.auto.sohu.com/*")) {
        return 'PROXY 10.16.5.37:80';
    }
	return 'DIRECT';
}