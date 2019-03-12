import {Values} from './values';

export interface Module {
  name: string;
  description: string;
  author: string;
  parameters: Parameters;
  running: boolean;
}

interface Parameters {
  'any.proxy.dst_address'?: Anyproxydstaddress;
  'any.proxy.dst_port'?: Anyproxydstaddress;
  'any.proxy.iface'?: Anyproxyiface;
  'any.proxy.protocol'?: Anyproxydstaddress;
  'any.proxy.src_address'?: Anyproxyiface;
  'any.proxy.src_port'?: Anyproxydstaddress;
  'api.rest.address'?: Anyproxydstaddress;
  'api.rest.certificate'?: Anyproxyiface;
  'api.rest.certificate.bits'?: Anyproxydstaddress;
  'api.rest.certificate.commonname'?: Anyproxydstaddress;
  'api.rest.certificate.country'?: Anyproxydstaddress;
  'api.rest.certificate.locality'?: Anyproxydstaddress;
  'api.rest.certificate.organization'?: Anyproxydstaddress;
  'api.rest.certificate.organizationalunit'?: Anyproxydstaddress;
  'api.rest.key'?: Anyproxyiface;
  'api.rest.password'?: Anyproxyiface;
  'api.rest.port'?: Anyproxydstaddress;
  'api.rest.username'?: Anyproxyiface;
  'api.rest.websocket'?: Anyproxydstaddress;
  'arp.spoof.internal'?: Anyproxydstaddress;
  'arp.spoof.targets'?: Anyproxyiface;
  'arp.spoof.whitelist'?: Anyproxyiface;
  'dhcp6.spoof.domains'?: Anyproxyiface;
  'dns.spoof.address'?: Anyproxydstaddress;
  'dns.spoof.all'?: Anyproxydstaddress;
  'dns.spoof.domains'?: Anyproxyiface;
  'dns.spoof.hosts'?: Anyproxyiface;
  'events.stream.output'?: Anyproxyiface;
  'gps.baudrate'?: Anyproxydstaddress;
  'gps.device'?: Anyproxyiface;
  'http.port'?: Anyproxydstaddress;
  'http.proxy.address'?: Anyproxydstaddress;
  'http.proxy.injectjs'?: Anyproxyiface;
  'http.proxy.port'?: Anyproxydstaddress;
  'http.proxy.script'?: Anyproxyiface;
  'http.proxy.sslstrip'?: Anyproxydstaddress;
  'http.server.address'?: Anyproxydstaddress;
  'http.server.certificate'?: Anyproxyiface;
  'http.server.certificate.bits'?: Anyproxydstaddress;
  'http.server.certificate.commonname'?: Anyproxydstaddress;
  'http.server.certificate.country'?: Anyproxydstaddress;
  'http.server.certificate.locality'?: Anyproxydstaddress;
  'http.server.certificate.organization'?: Anyproxydstaddress;
  'http.server.certificate.organizationalunit'?: Anyproxydstaddress;
  'http.server.key'?: Anyproxyiface;
  'http.server.path'?: Anyproxyiface;
  'http.server.port'?: Anyproxydstaddress;
  'https.port'?: Anyproxydstaddress;
  'https.proxy.address'?: Anyproxydstaddress;
  'https.proxy.certificate'?: Anyproxyiface;
  'https.proxy.certificate.bits'?: Anyproxydstaddress;
  'https.proxy.certificate.commonname'?: Anyproxydstaddress;
  'https.proxy.certificate.country'?: Anyproxydstaddress;
  'https.proxy.certificate.locality'?: Anyproxydstaddress;
  'https.proxy.certificate.organization'?: Anyproxydstaddress;
  'https.proxy.certificate.organizationalunit'?: Anyproxydstaddress;
  'https.proxy.injectjs'?: Anyproxyiface;
  'https.proxy.key'?: Anyproxyiface;
  'https.proxy.port'?: Anyproxydstaddress;
  'https.proxy.script'?: Anyproxyiface;
  'https.proxy.sslstrip'?: Anyproxydstaddress;
  'mac.changer.address'?: Anyproxydstaddress;
  'mac.changer.iface'?: Anyproxyiface;
  'mysql.server.address'?: Anyproxydstaddress;
  'mysql.server.infile'?: Anyproxyiface;
  'mysql.server.outfile'?: Anyproxyiface;
  'mysql.server.port'?: Anyproxydstaddress;
  'net.probe.mdns'?: Anyproxydstaddress;
  'net.probe.nbns'?: Anyproxydstaddress;
  'net.probe.throttle'?: Anyproxydstaddress;
  'net.probe.upnp'?: Anyproxydstaddress;
  'net.probe.wsd'?: Anyproxydstaddress;
  'net.show.meta'?: Anyproxydstaddress;
  'net.sniff.filter'?: Anyproxyiface;
  'net.sniff.local'?: Anyproxydstaddress;
  'net.sniff.output'?: Anyproxyiface;
  'net.sniff.regexp'?: Anyproxyiface;
  'net.sniff.source'?: Anyproxyiface;
  'net.sniff.verbose'?: Anyproxydstaddress;
  'packet.proxy.chain'?: Anyproxyiface;
  'packet.proxy.plugin'?: Anyproxyiface;
  'packet.proxy.queue.num'?: Anyproxydstaddress;
  'packet.proxy.rule'?: Anyproxyiface;
  'tcp.address'?: Anyproxydstaddress;
  'tcp.port'?: Anyproxydstaddress;
  'tcp.proxy.address'?: Anyproxydstaddress;
  'tcp.proxy.port'?: Anyproxydstaddress;
  'tcp.proxy.script'?: Anyproxyiface;
  'tcp.tunnel.address'?: Anyproxyiface;
  'tcp.tunnel.port'?: Anyproxydstaddress;
  'ticker.commands'?: Anyproxyiface;
  'ticker.period'?: Anyproxydstaddress;
  'wifi.ap.bssid'?: Anyproxydstaddress;
  'wifi.ap.channel'?: Anyproxydstaddress;
  'wifi.ap.encryption'?: Anyproxydstaddress;
  'wifi.ap.ssid'?: Anyproxyiface;
  'wifi.hop.period'?: Anyproxydstaddress;
  'wifi.skip-broken'?: Anyproxydstaddress;
  'wifi.source.file'?: Anyproxyiface;
}

interface Anyproxyiface {
  Name: string;
  Type: number;
  Value: string;
  Description: string;
  Validator?: any;
}

interface Anyproxydstaddress {
  Name: string;
  Type: number;
  Value: string;
  Description: string;
  Validator: Values;
}
