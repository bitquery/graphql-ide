const tokens = [
	{
	  "currency": {
		"symbol": "ETH",
		"address": "-",
		"name": "Ether"
	  },
	  "count": 1056869,
	  "senders": 194904,
	  "receivers": 226273,
	  "amount": 1916721.37044929,
	  "amount_usd": 3158847069.974121
	},
	{
	  "currency": {
		"symbol": "WETH",
		"address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
		"name": "Wrapped Ether"
	  },
	  "count": 559231,
	  "senders": 9755,
	  "receivers": 8950,
	  "amount": 2209317.4745027116,
	  "amount_usd": 3640114139.643071
	},
	{
	  "currency": {
		"symbol": "USDT",
		"address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
		"name": "Tether USD"
	  },
	  "count": 106493,
	  "senders": 44289,
	  "receivers": 49256,
	  "amount": 3063301784.845586,
	  "amount_usd": 3061673680.1402407
	},
	{
	  "currency": {
		"symbol": "USDC",
		"address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		"name": "USD//C"
	  },
	  "count": 40849,
	  "senders": 14454,
	  "receivers": 15377,
	  "amount": 3965742621.197937,
	  "amount_usd": 3966766248.578877
	},
	{
	  "currency": {
		"symbol": "B-BRN",
		"address": "0x3539ac68bc96fc1f470d7739a49bbbf3d321fd5d",
		"name": "Baby Burn: OpenSea Redeemable Example"
	  },
	  "count": 25206,
	  "senders": 86,
	  "receivers": 712,
	  "amount": 25206,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE2",
		"address": "0x6e835ac221d5622bf65ae21a22eb7484d1898598",
		"name": "Pepe2.0"
	  },
	  "count": 17921,
	  "senders": 1455,
	  "receivers": 2631,
	  "amount": 10327019286.301628,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0xbe042e9d09cb588331ff911c2b46fd833a3e5bd6",
		"name": "Pepe"
	  },
	  "count": 17584,
	  "senders": 2852,
	  "receivers": 3539,
	  "amount": 1594789135.9847376,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SG",
		"address": "0xbe74a95d159e8e323b8c1a70f825efc85fed27c4",
		"name": "SharesGram"
	  },
	  "count": 11916,
	  "senders": 1183,
	  "receivers": 2311,
	  "amount": 49935205.101768166,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPETWO",
		"address": "0x8a5b1e2413ea4b23fe342858e7cd3f338a399a3b",
		"name": "Pepe II"
	  },
	  "count": 10190,
	  "senders": 837,
	  "receivers": 1237,
	  "amount": 1113891675696.8318,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UЅDТ",
		"address": "0xa15b3d31f1f5d544933c35eb00568ead238b4f63",
		"name": "Tеthеr UЅD"
	  },
	  "count": 8667,
	  "senders": 5072,
	  "receivers": 6416,
	  "amount": 470311606.92166895,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "EIGENWORLDS",
		"address": "0x8d0802559775c70fb505f22988a4fd4a4f6d3b62",
		"name": "EigenWorlds"
	  },
	  "count": 7780,
	  "senders": 23,
	  "receivers": 7121,
	  "amount": 9.25117985e-10,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Reward Claim Position - https://BLEXfi.shop",
		"address": "0x514007f8f765c52b26b95d4230e2d24eeefcfdde",
		"name": "$ BLEXfi.shop"
	  },
	  "count": 7501,
	  "senders": 7501,
	  "receivers": 7501,
	  "amount": 10444631,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LINK",
		"address": "0x514910771af9ca656af840dff83e8264ecf986ca",
		"name": "ChainLink Token"
	  },
	  "count": 7295,
	  "senders": 1171,
	  "receivers": 1536,
	  "amount": 7731798.054674083,
	  "amount_usd": 46059707.583383664
	},
	{
	  "currency": {
		"symbol": "XEN",
		"address": "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
		"name": "XEN Crypto"
	  },
	  "count": 6998,
	  "senders": 292,
	  "receivers": 484,
	  "amount": 557207096242.8882,
	  "amount_usd": 403246.2041885099
	},
	{
	  "currency": {
		"symbol": "XRP",
		"address": "0x07e0edf8ce600fb51d44f51e3348d77d67f298ae",
		"name": "HarryPotterObamaPacMan8Inu"
	  },
	  "count": 6899,
	  "senders": 679,
	  "receivers": 2483,
	  "amount": 3384826.22443629,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "",
		"address": "0x0000000000a39bb272e79075ade125fd351887ac",
		"name": ""
	  },
	  "count": 6490,
	  "senders": 1566,
	  "receivers": 1568,
	  "amount": 13384.099635296436,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USᎠT",
		"address": "0x6cadc5ee253ae109068acc51ac2ffc3b172e2b76",
		"name": "Τether USᎠ"
	  },
	  "count": 6404,
	  "senders": 4233,
	  "receivers": 5455,
	  "amount": 528254344.709118,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE2.69",
		"address": "0xb194574195dfa41e82ef1b7f1b2c895139233d00",
		"name": "PEPE 2.69"
	  },
	  "count": 5854,
	  "senders": 698,
	  "receivers": 947,
	  "amount": 1215398537.8922677,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ՍЅDТ",
		"address": "0x061406c0d8b80a0c1ccc69f29fa0fd2f9c308eac",
		"name": "Тether ՍЅD"
	  },
	  "count": 5591,
	  "senders": 3099,
	  "receivers": 4931,
	  "amount": 39324016007.76834,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIA",
		"address": "0x43d7e65b8ff49698d9550a7f315c87e67344fb59",
		"name": "SHIA"
	  },
	  "count": 5572,
	  "senders": 1496,
	  "receivers": 1671,
	  "amount": 42125972.48948566,
	  "amount_usd": 21623741.652237378
	},
	{
	  "currency": {
		"symbol": "ЕТН",
		"address": "0x6a24d2f38c7bef5f7a6968e120e8e59f96e45a6b",
		"name": "ЕТН..."
	  },
	  "count": 5565,
	  "senders": 3332,
	  "receivers": 4143,
	  "amount": 27587.860461265813,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Chad Index",
		"address": "0xb777eb033557490abb7fb8f3948000826423ea07",
		"name": "CHAD"
	  },
	  "count": 4984,
	  "senders": 608,
	  "receivers": 919,
	  "amount": 3428032858.2334657,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYSHIA",
		"address": "0x846422103b109efbe7dd15f541c3dfc838fc1848",
		"name": "BabyShia"
	  },
	  "count": 4885,
	  "senders": 893,
	  "receivers": 1790,
	  "amount": 12941923435.070017,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Reward Claim Position - https://BLEXfi.pro",
		"address": "0xb5be7a3f2fac1ee6c19c264d1e534152f6f74bf9",
		"name": "$ BLEXfi.pro"
	  },
	  "count": 4801,
	  "senders": 4801,
	  "receivers": 4801,
	  "amount": 6690734,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GAMBLE",
		"address": "0xfb2c53db9140c96ef79341ef5574efb86fa5e90e",
		"name": "GAMBLE"
	  },
	  "count": 4603,
	  "senders": 594,
	  "receivers": 937,
	  "amount": 682532940.0172007,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DAI",
		"address": "0x6b175474e89094c44da98b954eedeac495271d0f",
		"name": "Dai Stablecoin"
	  },
	  "count": 4349,
	  "senders": 1646,
	  "receivers": 1604,
	  "amount": 692760626.3696421,
	  "amount_usd": 692667410.6242288
	},
	{
	  "currency": {
		"symbol": "SHIB",
		"address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
		"name": "SHIBA INU"
	  },
	  "count": 4265,
	  "senders": 1549,
	  "receivers": 2410,
	  "amount": 3203466655410.4404,
	  "amount_usd": 26035585.74434974
	},
	{
	  "currency": {
		"symbol": "APE",
		"address": "0x4d224452801aced8b2f0aebe155379bb5d594381",
		"name": "ApeCoin"
	  },
	  "count": 3882,
	  "senders": 976,
	  "receivers": 1064,
	  "amount": 21305553.26042615,
	  "amount_usd": 30788634.120709423
	},
	{
	  "currency": {
		"symbol": "FTOOLS",
		"address": "0xbc31802e3f11626c2d2b34ab809ad309610665fe",
		"name": "friendtools"
	  },
	  "count": 3728,
	  "senders": 377,
	  "receivers": 554,
	  "amount": 8184827.69393263,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "bERN",
		"address": "0x5e7cf1d89798ee7630dc1f4c90a260e8ca311925",
		"name": "Burn2Earn"
	  },
	  "count": 3712,
	  "senders": 540,
	  "receivers": 743,
	  "amount": 813721063.8775076,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LIM",
		"address": "0x9cdafb9fae77e7c1bd7cf28c389008ca8dacf48c",
		"name": "liquidity.money"
	  },
	  "count": 3602,
	  "senders": 549,
	  "receivers": 659,
	  "amount": 156448059.8340039,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PVP",
		"address": "0x9b44793a0177c84dd01ad81137db696531902871",
		"name": "PVP"
	  },
	  "count": 3533,
	  "senders": 293,
	  "receivers": 310,
	  "amount": 595790121.5275726,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Blips",
		"address": "0x412039ff52f96d18570395c4ddcaa2cac5707381",
		"name": "Blips"
	  },
	  "count": 3506,
	  "senders": 348,
	  "receivers": 777,
	  "amount": 3506,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "⠀",
		"address": "0xce48a5b7df3a83540e39b37fb8ceef2ba5419b7a",
		"name": "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀..."
	  },
	  "count": 3432,
	  "senders": 689,
	  "receivers": 998,
	  "amount": 136274175193707.73,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DogeShia",
		"address": "0x5c48391969f81427b1ecc02af58723c5c3384ba3",
		"name": "DogeShia"
	  },
	  "count": 3410,
	  "senders": 5,
	  "receivers": 2867,
	  "amount": 46940218267.69979,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYSHIB",
		"address": "0x00000000051b48047be6dc0ada6de5c3de86a588",
		"name": "Baby Shiba Inu"
	  },
	  "count": 3402,
	  "senders": 454,
	  "receivers": 672,
	  "amount": 154763671.8580695,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LinqB",
		"address": "0x192f4bef2b35ebe109d35ad5899665573ccb0978",
		"name": "LinqBot"
	  },
	  "count": 3382,
	  "senders": 453,
	  "receivers": 712,
	  "amount": 595338923.1835234,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LINQ",
		"address": "0x3e34eabf5858a126cb583107e643080cee20ca64",
		"name": "Linq"
	  },
	  "count": 3340,
	  "senders": 442,
	  "receivers": 713,
	  "amount": 12944875.599049473,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE3",
		"address": "0x75d23a0d987c55337b99491536fa58b1f2c461da",
		"name": "Pepe3.0"
	  },
	  "count": 3285,
	  "senders": 441,
	  "receivers": 596,
	  "amount": 11125601191.05132,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BITCOIN",
		"address": "0x72e4f9f808c49a2a61de9c5896298920dc4eeea9",
		"name": "HarryPotterObamaSonic10Inu"
	  },
	  "count": 3264,
	  "senders": 682,
	  "receivers": 752,
	  "amount": 181389909.25141796,
	  "amount_usd": 14360337.45265116
	},
	{
	  "currency": {
		"symbol": "PAC",
		"address": "0x76ee94ba953a10977bf66286829b4e723c77733c",
		"name": "HarryPotterTrumpPACMAN8Inu"
	  },
	  "count": 3175,
	  "senders": 432,
	  "receivers": 673,
	  "amount": 92014645058.47116,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BOBO",
		"address": "0x84837471e08cc392493d6902e125c287920f023d",
		"name": "Bobo"
	  },
	  "count": 3156,
	  "senders": 680,
	  "receivers": 997,
	  "amount": 13291553797.032146,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "JOJO",
		"address": "0xde85cb49a46f435a7c9f39520f3831a11e37674b",
		"name": "JOJO"
	  },
	  "count": 3063,
	  "senders": 582,
	  "receivers": 1195,
	  "amount": 1921726180082799.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SPX",
		"address": "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c",
		"name": "SPX6900"
	  },
	  "count": 3053,
	  "senders": 526,
	  "receivers": 612,
	  "amount": 1608825389.5875936,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SafeMoon",
		"address": "0x84e81efb4b282cd68da4864a8f009a2873996b89",
		"name": "SafeMoon"
	  },
	  "count": 3046,
	  "senders": 396,
	  "receivers": 600,
	  "amount": 9403603.26976192,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OINK",
		"address": "0x9da710465c089775be86744cbde408584a00fdaa",
		"name": "OINK"
	  },
	  "count": 2985,
	  "senders": 319,
	  "receivers": 432,
	  "amount": 9570123981.024044,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
		"name": "Pepe"
	  },
	  "count": 2984,
	  "senders": 1166,
	  "receivers": 988,
	  "amount": 19116937646858.766,
	  "amount_usd": 16500841.84845085
	},
	{
	  "currency": {
		"symbol": "$BLAST",
		"address": "0x7edf39d77d1862af78a18719245db9c9715b7f98",
		"name": "Blast Bet"
	  },
	  "count": 2962,
	  "senders": 269,
	  "receivers": 398,
	  "amount": 59237395.424213,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BBD",
		"address": "0x8a604e687401af4f8564486634bcf4f7830b9783",
		"name": "Bussin Base Degens"
	  },
	  "count": 2840,
	  "senders": 1,
	  "receivers": 153,
	  "amount": 2840,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GMT",
		"address": "0xe3c408bd53c31c085a1746af401a4042954ff740",
		"name": "GreenMetaverseToken"
	  },
	  "count": 2834,
	  "senders": 1404,
	  "receivers": 1319,
	  "amount": 95913227.95048128,
	  "amount_usd": 15437812.967609918
	},
	{
	  "currency": {
		"symbol": "BLOB",
		"address": "0x712d9170a0f4e9f4ab99a7f374dbba3a56420db8",
		"name": "Blob"
	  },
	  "count": 2795,
	  "senders": 792,
	  "receivers": 1157,
	  "amount": 17094672291.292215,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x4214d8690a5d860b63f51f882456ec0eec050f81",
		"name": "PEPE"
	  },
	  "count": 2779,
	  "senders": 180,
	  "receivers": 2286,
	  "amount": 5848838530.760347,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USDT",
		"address": "0x7dd5f67a25afb9e73d4966b1ac578dabd9ccc986",
		"name": "Tether USD"
	  },
	  "count": 2772,
	  "senders": 1413,
	  "receivers": 2125,
	  "amount": 191357863.392421,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HIPVP",
		"address": "0x0c0725282cbf037e6781fe84e0361b01daa88ddf",
		"name": "HIPvPGame"
	  },
	  "count": 2670,
	  "senders": 236,
	  "receivers": 179,
	  "amount": 9473641.235200634,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BUSD",
		"address": "0x4fabb145d64652a948d72533023f6e7a623c7c53",
		"name": "Binance USD"
	  },
	  "count": 2644,
	  "senders": 2379,
	  "receivers": 275,
	  "amount": 412561949.9359852,
	  "amount_usd": 412543890.0336309
	},
	{
	  "currency": {
		"symbol": "PEPESR",
		"address": "0x7a56eb3b8b66cf70f3b966f16af9810773f99c7b",
		"name": "Pepe Senior"
	  },
	  "count": 2635,
	  "senders": 288,
	  "receivers": 481,
	  "amount": 7384474691.614919,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPs",
		"address": "0x5e97e46671ae0e752ca2bfdab4388a610845c0d2",
		"name": "thePEPsProject"
	  },
	  "count": 2630,
	  "senders": 27,
	  "receivers": 270,
	  "amount": 2630,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BONE",
		"address": "0x9813037ee2218799597d83d4a5b6f3b6778218d9",
		"name": "BONE SHIBASWAP"
	  },
	  "count": 2615,
	  "senders": 1056,
	  "receivers": 1013,
	  "amount": 5982652.813356015,
	  "amount_usd": 7653225.498628929
	},
	{
	  "currency": {
		"symbol": "SHIB",
		"address": "0xb8533b829541a24eececdb0206da98852f58df3e",
		"name": "Shiba Inu"
	  },
	  "count": 2464,
	  "senders": 625,
	  "receivers": 724,
	  "amount": 2849900008.673468,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ЕТН",
		"address": "0xdfc04ba2287091324e809f548a9e6cb7a2e27a87",
		"name": "ЕТН..."
	  },
	  "count": 2458,
	  "senders": 926,
	  "receivers": 1978,
	  "amount": 7.237005577332263e+57,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHARES",
		"address": "0xebb82c932759b515b2efc1cfbb6bf2f6dbace404",
		"name": "shares.finance"
	  },
	  "count": 2444,
	  "senders": 600,
	  "receivers": 831,
	  "amount": 485242.1240612179,
	  "amount_usd": 3809031.963863011
	},
	{
	  "currency": {
		"symbol": "OPL",
		"address": "0xc0804a4eae02fdf7516f55a12990d282640a4961",
		"name": "OpenPool"
	  },
	  "count": 2424,
	  "senders": 472,
	  "receivers": 415,
	  "amount": 147624084.83797923,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BATTLE",
		"address": "0x63f314c44d164d5be423199afbfbe129d72d3ea6",
		"name": "Battleground"
	  },
	  "count": 2401,
	  "senders": 147,
	  "receivers": 168,
	  "amount": 277879691.70888835,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ADULT",
		"address": "0x565d3902d6a5a2d5ce28ff427423e88933334dd2",
		"name": "Adult Playground"
	  },
	  "count": 2391,
	  "senders": 271,
	  "receivers": 595,
	  "amount": 432653063.65940493,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PSYOP",
		"address": "0x3007083eaa95497cd6b2b809fb97b6a30bdf53d3",
		"name": "Psyop"
	  },
	  "count": 2365,
	  "senders": 442,
	  "receivers": 418,
	  "amount": 6772067343.136688,
	  "amount_usd": 6003154.840494398
	},
	{
	  "currency": {
		"symbol": "MATIC",
		"address": "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
		"name": "Matic Token"
	  },
	  "count": 2315,
	  "senders": 801,
	  "receivers": 1108,
	  "amount": 144177796.1493451,
	  "amount_usd": 80815110.88472873
	},
	{
	  "currency": {
		"symbol": "USDC",
		"address": "0x767550f670ddc1d45a14d66810ce7e56462d2de4",
		"name": "USD Coin"
	  },
	  "count": 2300,
	  "senders": 1488,
	  "receivers": 2229,
	  "amount": 123811029.556476,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "WBTC",
		"address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
		"name": "Wrapped BTC"
	  },
	  "count": 2287,
	  "senders": 524,
	  "receivers": 565,
	  "amount": 5943.5213549,
	  "amount_usd": 154760596.30912247
	},
	{
	  "currency": {
		"symbol": "BB",
		"address": "0x562e12e1e792643d168c1fa01c1b7198a0f83c9f",
		"name": "Bookiebot"
	  },
	  "count": 2275,
	  "senders": 349,
	  "receivers": 434,
	  "amount": 664743.5194473398,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYFLOKI",
		"address": "0xae83511c4ef07358e2d95b0c219a5f9eb8656a61",
		"name": "Baby Floki"
	  },
	  "count": 2225,
	  "senders": 346,
	  "receivers": 370,
	  "amount": 793658298571863.8,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DADSHIA",
		"address": "0x3e4d70a06a8275422549bca5c39027edb67d59eb",
		"name": "DAD SHIA"
	  },
	  "count": 2217,
	  "senders": 6,
	  "receivers": 2010,
	  "amount": 153392365541.72595,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "NCWW",
		"address": "0x35bbd082e5f40e9389ce0678980f5572aa864fd2",
		"name": "Nuclear Waste Wa"
	  },
	  "count": 2156,
	  "senders": 5,
	  "receivers": 1487,
	  "amount": 7913226501093.984,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ΕTH",
		"address": "0xac2c738ba30a9891a82d9543ac3da9970cde889c",
		"name": "Εthereum"
	  },
	  "count": 2145,
	  "senders": 929,
	  "receivers": 1605,
	  "amount": 40236950.10431009,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GEKE",
		"address": "0x471a202f69d6e975da55e363dab1bdb2e86e0c0f",
		"name": "Geke"
	  },
	  "count": 2144,
	  "senders": 525,
	  "receivers": 539,
	  "amount": 131000312797223.72,
	  "amount_usd": 1970596.978207608
	},
	{
	  "currency": {
		"symbol": "SARC",
		"address": "0xe89d930b1c795f9e88ab4f5733b9e1df8e7629e7",
		"name": "Sproto Ape Rug Club"
	  },
	  "count": 2125,
	  "senders": 4,
	  "receivers": 534,
	  "amount": 2125,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OT",
		"address": "0x78e12ac4c25c3f80c34cd7329c221a7427aa6247",
		"name": "OT"
	  },
	  "count": 2087,
	  "senders": 312,
	  "receivers": 411,
	  "amount": 592259929.518674,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BEN",
		"address": "0x9bf1d7d63dd7a4ce167cf4866388226eeefa702e",
		"name": "Ben"
	  },
	  "count": 2071,
	  "senders": 645,
	  "receivers": 706,
	  "amount": 219992882103782.2,
	  "amount_usd": 4333549.3984860815
	},
	{
	  "currency": {
		"symbol": "SOAPS",
		"address": "0xa2c798f6456e4928f1e029c971007a09416a3db0",
		"name": "Soaps Tech"
	  },
	  "count": 2071,
	  "senders": 330,
	  "receivers": 367,
	  "amount": 840680543.5148035,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BREPE",
		"address": "0xa0117792d4b100fd329b37e8ab4181df8a5b3326",
		"name": "BREPE"
	  },
	  "count": 2052,
	  "senders": 463,
	  "receivers": 498,
	  "amount": 1874853701231585.8,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FPEPE",
		"address": "0x5c74f20f0f044ed1671c240e963667bc8b974447",
		"name": "The Final Pepe"
	  },
	  "count": 2045,
	  "senders": 341,
	  "receivers": 469,
	  "amount": 3364179097634813,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ՍЅDС",
		"address": "0xe42a1317aa46a9c10edca4fbc43816470218757a",
		"name": "ՍЅD Сoin"
	  },
	  "count": 2025,
	  "senders": 898,
	  "receivers": 1836,
	  "amount": 24364701968.80873,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "EthlinQ",
		"address": "0x486c280024b5428459ec3360f99183a61d41d9a3",
		"name": "Ethlinq Tech"
	  },
	  "count": 1940,
	  "senders": 242,
	  "receivers": 360,
	  "amount": 91588915.0866503,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MONG",
		"address": "0x6d7f4f326d6dafbcacc8babfa9251b7754432e50",
		"name": "MONG COIN"
	  },
	  "count": 1940,
	  "senders": 199,
	  "receivers": 283,
	  "amount": 9007918241.857916,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CRV",
		"address": "0xd533a949740bb3306d119cc777fa900ba034cd52",
		"name": "Curve DAO Token"
	  },
	  "count": 1924,
	  "senders": 450,
	  "receivers": 524,
	  "amount": 83292024.0183235,
	  "amount_usd": 40457617.13238444
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0xa18f675bc165c3416b05c76a28c017f724117070",
		"name": "ETH"
	  },
	  "count": 1901,
	  "senders": 992,
	  "receivers": 1852,
	  "amount": 21332.788123477112,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LPT",
		"address": "0x58b6a8a3302369daec383334672404ee733ab239",
		"name": "Livepeer Token"
	  },
	  "count": 1870,
	  "senders": 1588,
	  "receivers": 183,
	  "amount": 2231017.3198513547,
	  "amount_usd": 16192522.38983352
	},
	{
	  "currency": {
		"symbol": "FEFE",
		"address": "0x5805ceab306d2836615b0b49ab0ec2c9171b1190",
		"name": "FEFE - The Pepe Killer"
	  },
	  "count": 1864,
	  "senders": 249,
	  "receivers": 377,
	  "amount": 900268667.7165103,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LIM_Dividend_Tracker",
		"address": "0x78d73a8c9142029197f88790f1fdf82c1ba1b296",
		"name": "LIM_Dividend_Tracker"
	  },
	  "count": 1862,
	  "senders": 544,
	  "receivers": 655,
	  "amount": 146476715.19892213,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AIDOGE",
		"address": "0x1b026ac6cdfe427abbe1472035690a2ce4c334b8",
		"name": "AIDOGE"
	  },
	  "count": 1834,
	  "senders": 101,
	  "receivers": 989,
	  "amount": 5895687087635673,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BOT",
		"address": "0x8aebff1b8330316f0dee695a3de4672840df9c13",
		"name": "MaestroUnibotBananaProdigyCoyoteTuff"
	  },
	  "count": 1822,
	  "senders": 233,
	  "receivers": 375,
	  "amount": 8578809.73918406,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAD",
		"address": "0x32b86b99441480a7e5bd3a26c124ec2373e3f015",
		"name": "BAD IDEA AI"
	  },
	  "count": 1817,
	  "senders": 349,
	  "receivers": 767,
	  "amount": 51160083325094.04,
	  "amount_usd": 3983037.641392748
	},
	{
	  "currency": {
		"symbol": "SHIBTECH",
		"address": "0x03b4bf2002811106690fd805435e1e229ae233e2",
		"name": "Shibarium Technology"
	  },
	  "count": 1812,
	  "senders": 207,
	  "receivers": 426,
	  "amount": 6554923374.112459,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BETSY",
		"address": "0x906af612f8706b384c7351268ffcd9d947a4d92c",
		"name": "BETSY"
	  },
	  "count": 1809,
	  "senders": 163,
	  "receivers": 198,
	  "amount": 3804840.20454118,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BTC",
		"address": "0xdb4ae26707af25b3bdf10d2d3fa6990b90a3d0f9",
		"name": "Bitcoin"
	  },
	  "count": 1775,
	  "senders": 432,
	  "receivers": 516,
	  "amount": 219780055.59322652,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VEG",
		"address": "0xfb6b23ade938ed16f769833b2ff92ca26303390b",
		"name": "Turkeys"
	  },
	  "count": 1768,
	  "senders": 258,
	  "receivers": 404,
	  "amount": 2315238.8873894,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DEVPEPE",
		"address": "0xc4dbf1f1b2d4e143b5a8311d2f618df922cdbbac",
		"name": "Devil Pepe"
	  },
	  "count": 1761,
	  "senders": 225,
	  "receivers": 352,
	  "amount": 6710251.159670908,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Linq_Dividend_Tracker",
		"address": "0x92464c77a8f74db2c41c176482ff529fe4d4ddb0",
		"name": "Linq_Dividend_Tracker"
	  },
	  "count": 1740,
	  "senders": 431,
	  "receivers": 699,
	  "amount": 14157317.49635236,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYPEPE",
		"address": "0x69cd13d248830602a60b1f20ab11f5049385877d",
		"name": "Baby Pepe"
	  },
	  "count": 1726,
	  "senders": 211,
	  "receivers": 236,
	  "amount": 251576651.57645014,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE3",
		"address": "0x706bdd0f989ee5945c2efb2e5135c1d98e33f029",
		"name": "Pepe3.0"
	  },
	  "count": 1711,
	  "senders": 337,
	  "receivers": 434,
	  "amount": 11303068000.931772,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CHAD",
		"address": "0x0f4eda620cb024a8d16631a890825ee126ffe554",
		"name": "ChadFinder"
	  },
	  "count": 1708,
	  "senders": 225,
	  "receivers": 365,
	  "amount": 5876076.064766857,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "jim",
		"address": "0xd807f7e2818db8eda0d28b5be74866338eaedb86",
		"name": "jim"
	  },
	  "count": 1702,
	  "senders": 286,
	  "receivers": 751,
	  "amount": 107134226500.92052,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RLB",
		"address": "0x046eee2cc3188071c02bfc1745a6b17c656e3f3d",
		"name": "Rollbit Coin"
	  },
	  "count": 1679,
	  "senders": 344,
	  "receivers": 448,
	  "amount": 133305420.16347313,
	  "amount_usd": 25544545.59979337
	},
	{
	  "currency": {
		"symbol": "UЅDС",
		"address": "0x95f2f9fea4e6acb0935b7830e399210469bd5880",
		"name": "UЅD Cоin"
	  },
	  "count": 1642,
	  "senders": 1039,
	  "receivers": 1099,
	  "amount": 121122846.42834301,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "JANUS",
		"address": "0x1e54962109ce4ddc772ca3e0b2ad8ed5a0d548a2",
		"name": "Janus Fans"
	  },
	  "count": 1640,
	  "senders": 256,
	  "receivers": 340,
	  "amount": 76357752.49585491,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GALA",
		"address": "0xd1d2eb1b1e90b638588728b4130137d262c87cae",
		"name": "Gala"
	  },
	  "count": 1571,
	  "senders": 642,
	  "receivers": 910,
	  "amount": 453795884.9699187,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "xTrades",
		"address": "0x86c7efffc54a9e7b4342356a5fcad80adcaa0a69",
		"name": "xTrades1000"
	  },
	  "count": 1567,
	  "senders": 295,
	  "receivers": 260,
	  "amount": 1720951.3580152004,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "stETH",
		"address": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
		"name": "Liquid staked Ether 2.0"
	  },
	  "count": 1547,
	  "senders": 459,
	  "receivers": 741,
	  "amount": 356640.954998398,
	  "amount_usd": 587350526.9364797
	},
	{
	  "currency": {
		"symbol": "BABYPEPE",
		"address": "0x16e04d776e1b647be948c6d2f51bca26401dc011",
		"name": "BABYPEPE"
	  },
	  "count": 1501,
	  "senders": 346,
	  "receivers": 447,
	  "amount": 13352705522.295977,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNIBOT",
		"address": "0xf819d9cb1c2a819fd991781a822de3ca8607c3c9",
		"name": "Unibot"
	  },
	  "count": 1500,
	  "senders": 301,
	  "receivers": 353,
	  "amount": 42271.64589009558,
	  "amount_usd": 5946230.930120748
	},
	{
	  "currency": {
		"symbol": "ENS",
		"address": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
		"name": "Ethereum Name Service"
	  },
	  "count": 1499,
	  "senders": 334,
	  "receivers": 198,
	  "amount": 1499,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LinqBot_Dividend_Tracker",
		"address": "0x375340c69444e1e5b4d49be9ff0fc9ade0251b9e",
		"name": "LinqBot_Dividend_Tracker"
	  },
	  "count": 1470,
	  "senders": 448,
	  "receivers": 701,
	  "amount": 337822831.0360761,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OGPEPE",
		"address": "0x0595ed33f05faeffe22d2a732a52d28117836a09",
		"name": "ORIGINAL PEPE THE FROG"
	  },
	  "count": 1470,
	  "senders": 224,
	  "receivers": 283,
	  "amount": 95568469.65049995,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CHAD",
		"address": "0x7d7ef607a2b7ab675194d85eb03b276a93f6b71d",
		"name": "Chad"
	  },
	  "count": 1468,
	  "senders": 331,
	  "receivers": 526,
	  "amount": 7246162318.559994,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LIB",
		"address": "0xc91a77ad739ae3b64efb203c05e056500690f6fa",
		"name": "liquidity.best"
	  },
	  "count": 1465,
	  "senders": 172,
	  "receivers": 249,
	  "amount": 498756840.3952569,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIB2",
		"address": "0xbf671a2efc317c33cb35125fa0afdbbc92874431",
		"name": "SHIB2.0"
	  },
	  "count": 1453,
	  "senders": 181,
	  "receivers": 316,
	  "amount": 610149702.8940182,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HEHE",
		"address": "0x5d23d79b2e7a4c5c83e676e830eae3d9c9e1d96e",
		"name": "Pepe Killer"
	  },
	  "count": 1425,
	  "senders": 346,
	  "receivers": 445,
	  "amount": 13474788584.563253,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TDG2.0",
		"address": "0x353323d2de0cf306ba2fbf7485a66eefdfe0af39",
		"name": "TDG2.0"
	  },
	  "count": 1398,
	  "senders": 280,
	  "receivers": 360,
	  "amount": 307197064828969.06,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TNGR",
		"address": "0x1a4ceef5d575c2228d142ef862a9b60be8161e7f",
		"name": "Tengria"
	  },
	  "count": 1380,
	  "senders": 6,
	  "receivers": 436,
	  "amount": 9.48954e-13,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ARBOT",
		"address": "0x723696965f47b990dff00064fcaca95f0ee01123",
		"name": "Arbot"
	  },
	  "count": 1364,
	  "senders": 175,
	  "receivers": 314,
	  "amount": 379681248.49437267,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "0xB",
		"address": "0xae282fd4847016cde1634ed970c37877cbdb28a1",
		"name": "0xBet"
	  },
	  "count": 1360,
	  "senders": 117,
	  "receivers": 402,
	  "amount": 5182378990.996645,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PNDC",
		"address": "0x423f4e6138e475d85cf7ea071ac92097ed631eea",
		"name": "Pond Coin"
	  },
	  "count": 1359,
	  "senders": 362,
	  "receivers": 329,
	  "amount": 1701275184635.6724,
	  "amount_usd": 2177035.2607276244
	},
	{
	  "currency": {
		"symbol": "SB",
		"address": "0x732c86e2531601bdf6a93bb19b1a5da9f5502da1",
		"name": "SharesBot"
	  },
	  "count": 1322,
	  "senders": 213,
	  "receivers": 299,
	  "amount": 8025564.12762666,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEEPA",
		"address": "0x17cb7e814a0306a837b5de80cb3d8a4f521e019a",
		"name": "Wife Of Pepe"
	  },
	  "count": 1318,
	  "senders": 379,
	  "receivers": 508,
	  "amount": 3826382224139131.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$Q0xO",
		"address": "0x0bc93ab337ce9ae705c33ee173bbcbf3647099e0",
		"name": "Quantum Oracle"
	  },
	  "count": 1292,
	  "senders": 174,
	  "receivers": 303,
	  "amount": 89325509.95718291,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CULTUREPASS",
		"address": "0x41f0752d00b1aee6132e6b90142d7f87cede6422",
		"name": "CONGRATULATIONS - YOU MADE IT! Welcome to CULTURE PASS Token! CULTURE PASS token is a gateway to riches. Holding CULTURE PASS allows the holder to be the fir..."
	  },
	  "count": 1289,
	  "senders": 416,
	  "receivers": 823,
	  "amount": 2287,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AIMBOT",
		"address": "0x0c48250eb1f29491f1efbeec0261eb556f0973c7",
		"name": "AimBot"
	  },
	  "count": 1282,
	  "senders": 206,
	  "receivers": 311,
	  "amount": 67096.60314979435,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TRUMP",
		"address": "0x576e2bed8f7b46d34016198911cdf9886f78bea7",
		"name": "MAGA"
	  },
	  "count": 1270,
	  "senders": 198,
	  "receivers": 238,
	  "amount": 10380766.204840926,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PENGYX",
		"address": "0x3aeff9536ced04e4443908cb0cebac952a5550c3",
		"name": "PENGYX"
	  },
	  "count": 1266,
	  "senders": 96,
	  "receivers": 646,
	  "amount": 8046853019.318209,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USᎠC",
		"address": "0x241677fbd895e54e37665e3923703a98ce91d12d",
		"name": "USᎠ Ꮯoin"
	  },
	  "count": 1254,
	  "senders": 978,
	  "receivers": 1162,
	  "amount": 272503128.771726,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SILKROAD",
		"address": "0x1142866f451d9d5281c5c8349a332bd338e552a1",
		"name": "SuperMarioPorsche911inu"
	  },
	  "count": 1220,
	  "senders": 310,
	  "receivers": 336,
	  "amount": 1767886911588812.2,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DOGE2",
		"address": "0x2b22138cc6a9d6cbb21a0873b25461ed41fba691",
		"name": "Doge2.0"
	  },
	  "count": 1194,
	  "senders": 191,
	  "receivers": 267,
	  "amount": 82836364570.10915,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ARCEUS",
		"address": "0x1b83287c697afe296780e84735c5173c2140fa82",
		"name": "Arceus"
	  },
	  "count": 1180,
	  "senders": 220,
	  "receivers": 266,
	  "amount": 412465046.33400476,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ARDVRK",
		"address": "0xd0e94bf2466979b81d738c34058d4a6559c4d8be",
		"name": "Aardvark"
	  },
	  "count": 1173,
	  "senders": 197,
	  "receivers": 227,
	  "amount": 264596405.42482635,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LinQP",
		"address": "0x8b9a53321ee0f6aa1bea3a26a231cac6386ba777",
		"name": "LinQPool"
	  },
	  "count": 1167,
	  "senders": 170,
	  "receivers": 214,
	  "amount": 423574876.65100235,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GUISE",
		"address": "0x7721a4cb6190edb11d47f51c20968436eccdafb8",
		"name": "GUISE"
	  },
	  "count": 1166,
	  "senders": 228,
	  "receivers": 264,
	  "amount": 1728810.478302696,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BLOCK",
		"address": "0x226d6d842d49b4d757bef1632053a198d5d9c8aa",
		"name": "Block Browser"
	  },
	  "count": 1163,
	  "senders": 135,
	  "receivers": 296,
	  "amount": 4374640.872223421,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OpenPool_Dividend_Tracker",
		"address": "0x87e7a421c0d44a5fdbde9b6106d2ac5932b84de1",
		"name": "OpenPool_Dividend_Tracker"
	  },
	  "count": 1163,
	  "senders": 468,
	  "receivers": 409,
	  "amount": 138877792.5021474,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DOGE",
		"address": "0x244449823ce685dd3ce11993abc49b5f71342503",
		"name": "Dogecoin"
	  },
	  "count": 1161,
	  "senders": 154,
	  "receivers": 209,
	  "amount": 5732530294.194588,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FLIPS",
		"address": "0x6557b7770963d5a9aaacf6aa69d81f2ffbecfe6f",
		"name": "EthFlips"
	  },
	  "count": 1136,
	  "senders": 158,
	  "receivers": 250,
	  "amount": 783272032325.1238,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Pepe 3.0",
		"address": "0x3a5b6ddceaf1771e4f12e1ad4cf8a35d54699769",
		"name": "Pepe 3.0"
	  },
	  "count": 1128,
	  "senders": 159,
	  "receivers": 226,
	  "amount": 789456661.159726,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "21",
		"address": "0x32c7df89f472eed62d6e0609fcd9efac579f1d60",
		"name": "21 Blackjack Bot"
	  },
	  "count": 1111,
	  "senders": 184,
	  "receivers": 254,
	  "amount": 58585635.496745,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DADC",
		"address": "0x86a07f413a5958291b66c9dae4f57c6130940fb9",
		"name": "DADC"
	  },
	  "count": 1093,
	  "senders": 8,
	  "receivers": 383,
	  "amount": 2182693880.888977,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MONEY",
		"address": "0x8acc88ce0f700167ce47944e8f2a8edd00ee7c98",
		"name": "Money Protocol"
	  },
	  "count": 1083,
	  "senders": 154,
	  "receivers": 321,
	  "amount": 419939613.9530199,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CYBER",
		"address": "0x14778860e937f509e651192a90589de711fb88a9",
		"name": "CyberConnect"
	  },
	  "count": 1070,
	  "senders": 421,
	  "receivers": 419,
	  "amount": 4310274.908235356,
	  "amount_usd": 16337733.696901241
	},
	{
	  "currency": {
		"symbol": "STEALTH",
		"address": "0xb18f98822c22492bd6b77d19cae9367f3d60fcbf",
		"name": "StealthPad"
	  },
	  "count": 1064,
	  "senders": 152,
	  "receivers": 214,
	  "amount": 1257254563.775754,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE0.5",
		"address": "0xe3f904ead362a1d72d21c1fb5465df9671b44a40",
		"name": "Pepe 0.5"
	  },
	  "count": 1060,
	  "senders": 167,
	  "receivers": 248,
	  "amount": 38633349.74118705,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x82d94379297b8bfca4cb8d3431562c5225a68347",
		"name": "CULTURE PEPE"
	  },
	  "count": 1047,
	  "senders": 204,
	  "receivers": 318,
	  "amount": 6554413967.105139,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DOGE",
		"address": "0x44abe15f1a4a254404a09a58a371bd9533ccfa8f",
		"name": "Dogecoin"
	  },
	  "count": 1041,
	  "senders": 371,
	  "receivers": 308,
	  "amount": 977247705303.608,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "spurdo",
		"address": "0x59c6766de1dc50a9c9db86cb0461b5ce07408ab7",
		"name": "spurdo"
	  },
	  "count": 1036,
	  "senders": 209,
	  "receivers": 180,
	  "amount": 15586573564060.72,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAG",
		"address": "0x235c8ee913d93c68d2902a8e0b5a643755705726",
		"name": "tehBag"
	  },
	  "count": 1034,
	  "senders": 146,
	  "receivers": 226,
	  "amount": 52768734.7235466,
	  "amount_usd": 596535.1173332138
	},
	{
	  "currency": {
		"symbol": "BABYPEPE",
		"address": "0xde1802ee6ff990c121b748107ab34f17b9bc7978",
		"name": "Baby PEPE"
	  },
	  "count": 1033,
	  "senders": 233,
	  "receivers": 268,
	  "amount": 1946299671142441.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HEX",
		"address": "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
		"name": "HEX"
	  },
	  "count": 1027,
	  "senders": 262,
	  "receivers": 378,
	  "amount": 830231913.605056,
	  "amount_usd": 3304148.5937764733
	},
	{
	  "currency": {
		"symbol": "INU",
		"address": "0x8423b76be8ef6ca7400a6b4c334d29c1d5d4572c",
		"name": "HarryPotterObamaInu"
	  },
	  "count": 1020,
	  "senders": 121,
	  "receivers": 121,
	  "amount": 608935026.704016,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$PAAL",
		"address": "0x14fee680690900ba0cccfc76ad70fd1b95d10e16",
		"name": "PAAL AI"
	  },
	  "count": 1016,
	  "senders": 220,
	  "receivers": 282,
	  "amount": 31007354.145018507,
	  "amount_usd": 1004017.8963066489
	},
	{
	  "currency": {
		"symbol": "SHOP",
		"address": "0x99e186e8671db8b10d45b7a1c430952a9fbe0d40",
		"name": "Shop Bot"
	  },
	  "count": 1011,
	  "senders": 190,
	  "receivers": 193,
	  "amount": 34916097.49362868,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "QNT",
		"address": "0x4a220e6096b25eadb88358cb44068a3248254675",
		"name": "Quant"
	  },
	  "count": 1006,
	  "senders": 434,
	  "receivers": 694,
	  "amount": 87302.26506989164,
	  "amount_usd": 8873015.85772438
	},
	{
	  "currency": {
		"symbol": "DDDD",
		"address": "0xd9bf1095718405b4df89f8e54ecc6d388ae2be91",
		"name": "danglydoodads"
	  },
	  "count": 1000,
	  "senders": 1,
	  "receivers": 1,
	  "amount": 5.005e-13,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE2.0",
		"address": "0xde63ba3e1ca0600099b13901648dfaad35fa34c0",
		"name": "Pepe 2.0"
	  },
	  "count": 996,
	  "senders": 168,
	  "receivers": 210,
	  "amount": 7672691851.949233,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USDT",
		"address": "0x88ef1beca37b59cd794976b16a7c226fd7424d0c",
		"name": "Tether USD"
	  },
	  "count": 989,
	  "senders": 642,
	  "receivers": 904,
	  "amount": 28925137.048233,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OX",
		"address": "0x78a0a62fba6fb21a83fe8a3433d44c73a4017a6f",
		"name": "Open Exchange Token"
	  },
	  "count": 955,
	  "senders": 296,
	  "receivers": 319,
	  "amount": 154271656.89361846,
	  "amount_usd": 7939376.1392296245
	},
	{
	  "currency": {
		"symbol": "MKR",
		"address": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
		"name": "Maker"
	  },
	  "count": 950,
	  "senders": 189,
	  "receivers": 221,
	  "amount": 22969.253525638083,
	  "amount_usd": 23808148.67865458
	},
	{
	  "currency": {
		"symbol": "LPS",
		"address": "0xa66c5e10cff7e8ca4f9497018d3f9a7f0b9b9e91",
		"name": "LPShares"
	  },
	  "count": 936,
	  "senders": 73,
	  "receivers": 248,
	  "amount": 503512927.67074066,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TOOLS",
		"address": "0xc14b4d4ca66f40f352d7a50fd230ef8b2fb3b8d4",
		"name": "BLOCKTOOLS"
	  },
	  "count": 932,
	  "senders": 188,
	  "receivers": 384,
	  "amount": 76830.87624102453,
	  "amount_usd": 737488.8581757077
	},
	{
	  "currency": {
		"symbol": "WSB",
		"address": "0xdeb5d3d31da6e9b5d76a6a399f1a51dd94a2707d",
		"name": "WALL STREET BABY"
	  },
	  "count": 930,
	  "senders": 211,
	  "receivers": 325,
	  "amount": 4966278781.849378,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VRA",
		"address": "0xf411903cbc70a74d22900a5de66a2dda66507255",
		"name": "VERA"
	  },
	  "count": 928,
	  "senders": 400,
	  "receivers": 431,
	  "amount": 1113679890.2710538,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "POV",
		"address": "0x8a8a53c18799cb9d099e94c97dd33762196b2072",
		"name": "Pepe Original Vision"
	  },
	  "count": 924,
	  "senders": 94,
	  "receivers": 160,
	  "amount": 6241576699.942964,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OTDividendTracker",
		"address": "0x4bd3862516848e9d6b2ade3e814dc14bbc245056",
		"name": "OTDividentTracker"
	  },
	  "count": 913,
	  "senders": 308,
	  "receivers": 407,
	  "amount": 313887998.56971145,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MEVY",
		"address": "0x6b9af55a51c721cf65072aaf891b3a1e3a3c5162",
		"name": "MEV Tools"
	  },
	  "count": 911,
	  "senders": 169,
	  "receivers": 207,
	  "amount": 8584105.822599536,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AKRO",
		"address": "0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7",
		"name": "Akropolis"
	  },
	  "count": 902,
	  "senders": 190,
	  "receivers": 234,
	  "amount": 406597778.493759,
	  "amount_usd": 6947809.614055061
	},
	{
	  "currency": {
		"symbol": "XSHIB",
		"address": "0xbc9683ee9525c4525e7e0dcffe8eed1447fd4287",
		"name": "XSHIB"
	  },
	  "count": 901,
	  "senders": 89,
	  "receivers": 400,
	  "amount": 793800450.3266027,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE2.0",
		"address": "0xfb66321d7c674995dfcc2cb67a30bc978dc862ad",
		"name": "Pepe 2.0"
	  },
	  "count": 899,
	  "senders": 160,
	  "receivers": 175,
	  "amount": 70519413254104.42,
	  "amount_usd": 782275.9007687381
	},
	{
	  "currency": {
		"symbol": "wstETH",
		"address": "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
		"name": "Wrapped liquid staked Ether 2.0"
	  },
	  "count": 897,
	  "senders": 194,
	  "receivers": 217,
	  "amount": 445868.20128528186,
	  "amount_usd": 835533957.723672
	},
	{
	  "currency": {
		"symbol": "PEIPEI",
		"address": "0x66dc3bee696310d6ef0173fd9c6c3d900766315b",
		"name": "PEIPEI"
	  },
	  "count": 897,
	  "senders": 140,
	  "receivers": 217,
	  "amount": 6019657432.352551,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPAI",
		"address": "0xc92c8da14964fcedbf513143222718a0e84c862a",
		"name": "Pepe Samurai"
	  },
	  "count": 896,
	  "senders": 142,
	  "receivers": 198,
	  "amount": 3117160184.9899235,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "NEWS",
		"address": "0x2f8221e82e0d4669ad66eabf02a5baed43ea49e7",
		"name": "Newsly"
	  },
	  "count": 884,
	  "senders": 187,
	  "receivers": 224,
	  "amount": 15584064.624039136,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE1",
		"address": "0xabc3a0b64c47334d2f2fe5cf68de23c183813bb9",
		"name": "PEPE #1"
	  },
	  "count": 881,
	  "senders": 235,
	  "receivers": 314,
	  "amount": 4327702520.210376,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "x48",
		"address": "0x39128de253c0a973d269c79b738c451d113e6b98",
		"name": "x48Tools"
	  },
	  "count": 876,
	  "senders": 137,
	  "receivers": 196,
	  "amount": 7219974386.190753,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LIL",
		"address": "0x575252412acdeeceb7c08db0ee3ce75b33cadbdb",
		"name": "Lil"
	  },
	  "count": 874,
	  "senders": 351,
	  "receivers": 268,
	  "amount": 278770865021.77527,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ՍSDC",
		"address": "0x13d7d0b70e2310f3a45b555760335ec8ab6ff6f0",
		"name": "ՍSD Coin"
	  },
	  "count": 866,
	  "senders": 409,
	  "receivers": 593,
	  "amount": 118261684.217674,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "EthLinQ_Dividend_Tracker",
		"address": "0x12c7f0bdb928480dc23f284bd369443fec72aebb",
		"name": "EthLinQ_Dividend_Tracker"
	  },
	  "count": 864,
	  "senders": 239,
	  "receivers": 357,
	  "amount": 85331618.81504096,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SAITAMA",
		"address": "0x08fec44a6fda65b62f82ff851fa1103e08a8c2fe",
		"name": "Saitama"
	  },
	  "count": 853,
	  "senders": 204,
	  "receivers": 284,
	  "amount": 7241648442.340452,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Mog",
		"address": "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a",
		"name": "Mog Coin"
	  },
	  "count": 851,
	  "senders": 245,
	  "receivers": 298,
	  "amount": 58643342166176.83,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ƎԀƎԀ",
		"address": "0x7e66ca0422ea28f4dd68f02a600562249ed5ffa6",
		"name": "ǝdǝԀ"
	  },
	  "count": 844,
	  "senders": 132,
	  "receivers": 186,
	  "amount": 671890064.0905052,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPECASH",
		"address": "0x891b45dbbbfd08ccede429527609e4f4813092b4",
		"name": "PEPECASH"
	  },
	  "count": 839,
	  "senders": 120,
	  "receivers": 184,
	  "amount": 475230951.38210976,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "API3",
		"address": "0x0b38210ea11411557c13457d4da7dc6ea731b88a",
		"name": "API3"
	  },
	  "count": 835,
	  "senders": 212,
	  "receivers": 225,
	  "amount": 13965776.370217228,
	  "amount_usd": 14545789.100574326
	},
	{
	  "currency": {
		"symbol": "LANDWOLF",
		"address": "0x898f933c837de1207449e1bf1ef52cc0d16ae5b8",
		"name": "LandWolf"
	  },
	  "count": 834,
	  "senders": 114,
	  "receivers": 163,
	  "amount": 6470063368.611576,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "XRP20",
		"address": "0xe4ab0be415e277d82c38625b72bd7dea232c2e7d",
		"name": "XRP20"
	  },
	  "count": 816,
	  "senders": 124,
	  "receivers": 279,
	  "amount": 1792983321.8348856,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PepeB",
		"address": "0xf551e3d164a77b2a637d4c11286a6ac05fc3f3d4",
		"name": "Pepe Burn"
	  },
	  "count": 816,
	  "senders": 105,
	  "receivers": 148,
	  "amount": 4693909.939865,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Wlinq",
		"address": "0xfb596fac783c2169973ff38f2139c1c0e5254b36",
		"name": "WindowsLiquidity"
	  },
	  "count": 811,
	  "senders": 95,
	  "receivers": 216,
	  "amount": 394153335.5041965,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VISA",
		"address": "0x90b69af3bbe1731a90bde642eda577d9d6a4fd6a",
		"name": "OpenVisa"
	  },
	  "count": 804,
	  "senders": 126,
	  "receivers": 160,
	  "amount": 633840531.3312572,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "STDC",
		"address": "0x3b685ab8586cda9f4385aa89d5bd979f78a4ab9a",
		"name": "STAND"
	  },
	  "count": 801,
	  "senders": 2,
	  "receivers": 801,
	  "amount": 3505.2427,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0x05aa4ad6eb5d638d16ece98c17e0d476ad67509b",
		"name": "Ethereum"
	  },
	  "count": 793,
	  "senders": 251,
	  "receivers": 284,
	  "amount": 11686840992.603212,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "X-Bird",
		"address": "0x297b847eeba84a99feb619ea5f8c04488acc54a7",
		"name": "X-Bird"
	  },
	  "count": 791,
	  "senders": 50,
	  "receivers": 326,
	  "amount": 4153370182.2118263,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FLRBRG",
		"address": "0x9138c8779a0ac8a84d69617d5715bd8afa23c650",
		"name": "Floor Cheese Burger"
	  },
	  "count": 789,
	  "senders": 123,
	  "receivers": 389,
	  "amount": 18878439228.384987,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ETHEREUM",
		"address": "0x24249b5a869a445c9b0ce269a08d73c618df9d21",
		"name": "HarryPotterTrumpHomerSimpson777Inu"
	  },
	  "count": 782,
	  "senders": 132,
	  "receivers": 148,
	  "amount": 228326260.3994758,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI",
		"address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
		"name": "Uniswap"
	  },
	  "count": 779,
	  "senders": 328,
	  "receivers": 449,
	  "amount": 6674481.980117978,
	  "amount_usd": 31208157.55370557
	},
	{
	  "currency": {
		"symbol": "BPEPEINU",
		"address": "0x1abb07e4c104123e71775b9b7a72e873fa32ab26",
		"name": "BABY PEPE INU"
	  },
	  "count": 775,
	  "senders": 125,
	  "receivers": 199,
	  "amount": 619139486.72589,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE2.50",
		"address": "0xad19662b14fa9cb00f1a58fdd34428855da4de00",
		"name": "Pepe2.50"
	  },
	  "count": 771,
	  "senders": 122,
	  "receivers": 177,
	  "amount": 663614907.7864406,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOS",
		"address": "0x32cb677ba80d9f78ed557d7e82bedf3bb271f449",
		"name": "Solidity Security"
	  },
	  "count": 752,
	  "senders": 136,
	  "receivers": 169,
	  "amount": 1600263178.7192905,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "X",
		"address": "0xa62894d5196bc44e4c3978400ad07e7b30352372",
		"name": "X"
	  },
	  "count": 750,
	  "senders": 160,
	  "receivers": 177,
	  "amount": 116357892193.8387,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BITROCK",
		"address": "0xde67d97b8770dc98c746a3fc0093c538666eb493",
		"name": "Bitrock"
	  },
	  "count": 747,
	  "senders": 170,
	  "receivers": 225,
	  "amount": 7089894.073798109,
	  "amount_usd": 602856.1288882578
	},
	{
	  "currency": {
		"symbol": "X",
		"address": "0xabec00542d141bddf58649bfe860c6449807237c",
		"name": "X.com"
	  },
	  "count": 739,
	  "senders": 121,
	  "receivers": 151,
	  "amount": 5016768.0034706425,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FEN",
		"address": "0x0a3e3318c34cac17b6a9ec55cb8f5f01c4d0f5ab",
		"name": "FE&N"
	  },
	  "count": 737,
	  "senders": 3,
	  "receivers": 121,
	  "amount": 737,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AUDO",
		"address": "0x2a52368e42a081bb46453ffc4d562a2014438d98",
		"name": "Audinals"
	  },
	  "count": 737,
	  "senders": 118,
	  "receivers": 168,
	  "amount": 120062834.29949424,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BETMORE",
		"address": "0x0fe1017ee86773835c55f48712cbcd1698f17cf5",
		"name": "Bet More"
	  },
	  "count": 722,
	  "senders": 124,
	  "receivers": 178,
	  "amount": 4639689964919173,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PRIME",
		"address": "0xb23d80f5fefcddaa212212f028021b41ded428cf",
		"name": "Prime"
	  },
	  "count": 708,
	  "senders": 181,
	  "receivers": 201,
	  "amount": 1509922.1994997174,
	  "amount_usd": 4726678.980625429
	},
	{
	  "currency": {
		"symbol": "FUNPASS",
		"address": "0x0000000000664ceffed39244a8312bd895470803",
		"name": "mint.fun !fundrop pass"
	  },
	  "count": 705,
	  "senders": 1,
	  "receivers": 705,
	  "amount": 2.92376907e-10,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DEV",
		"address": "0x0e5e41c7c837b4ca28a11c744f8818593b714c64",
		"name": "DeVerse"
	  },
	  "count": 704,
	  "senders": 187,
	  "receivers": 126,
	  "amount": 152895584.35919493,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BANK",
		"address": "0x9360c489056b64d5003bf22f4f31458e31cc8028",
		"name": "First Republic Bank of Crypto"
	  },
	  "count": 703,
	  "senders": 62,
	  "receivers": 107,
	  "amount": 527607361.9195219,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "IMP",
		"address": "0x27a8e1a107404dad49d7448711e8d06e4f5da9be",
		"name": "Impersonator"
	  },
	  "count": 702,
	  "senders": 94,
	  "receivers": 148,
	  "amount": 8298589373.836276,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GRT",
		"address": "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
		"name": "Graph Token"
	  },
	  "count": 701,
	  "senders": 272,
	  "receivers": 399,
	  "amount": 75687762.03455476,
	  "amount_usd": 6794905.890772594
	},
	{
	  "currency": {
		"symbol": "LBR",
		"address": "0xf1182229b71e79e504b1d2bf076c15a277311e05",
		"name": "LBR"
	  },
	  "count": 699,
	  "senders": 197,
	  "receivers": 264,
	  "amount": 1925494.3371928863,
	  "amount_usd": 2908596.389520097
	},
	{
	  "currency": {
		"symbol": "AAVE",
		"address": "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
		"name": "Aave Token"
	  },
	  "count": 698,
	  "senders": 231,
	  "receivers": 322,
	  "amount": 606007.1234772563,
	  "amount_usd": 34520193.47704156
	},
	{
	  "currency": {
		"symbol": "MOMO v2",
		"address": "0x08d0222a206d1aee59a9b66969c04fd1e8a0f864",
		"name": "MOMO v2"
	  },
	  "count": 697,
	  "senders": 172,
	  "receivers": 189,
	  "amount": 324483168967.0206,
	  "amount_usd": 492491.79847212665
	},
	{
	  "currency": {
		"symbol": "JVL",
		"address": "0xb8cb60d07056d54df518785de9600bd4e6b2b53b",
		"name": "Javelin Game Token"
	  },
	  "count": 694,
	  "senders": 53,
	  "receivers": 48,
	  "amount": 638336023.582358,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MRSPEPE",
		"address": "0x6aad0edd084ab7b57a770eb94d17939dc2548539",
		"name": "Mrs Pepe"
	  },
	  "count": 693,
	  "senders": 109,
	  "receivers": 164,
	  "amount": 5958281450.806701,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "WOJAK",
		"address": "0xbde71cb88777b7cde1d2325dabeb44e55824b92c",
		"name": "Wojak"
	  },
	  "count": 688,
	  "senders": 261,
	  "receivers": 213,
	  "amount": 38230517.75885788,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ALD",
		"address": "0x1e1d8d6d00e0b8f9102d2b3d77de439774a70e97",
		"name": "Aladdin"
	  },
	  "count": 688,
	  "senders": 129,
	  "receivers": 138,
	  "amount": 39558052.037044466,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BNT",
		"address": "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
		"name": "Bancor Network Token"
	  },
	  "count": 687,
	  "senders": 178,
	  "receivers": 152,
	  "amount": 12510045.638760285,
	  "amount_usd": 5235035.0379057275
	},
	{
	  "currency": {
		"symbol": "AIMBOT_Dividends",
		"address": "0x93314ee69bf8f943504654f9a8eced0071526439",
		"name": "AIMBOT_Dividends"
	  },
	  "count": 680,
	  "senders": 205,
	  "receivers": 310,
	  "amount": 65117.19202331777,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPEC",
		"address": "0x4112f42c51588ac62bda09b4ceddbee04ca04fb7",
		"name": "Pepe Classic"
	  },
	  "count": 676,
	  "senders": 106,
	  "receivers": 147,
	  "amount": 6444420161.470522,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MAMA",
		"address": "0x8b7b0a69905146accf42bfc8f6bc867a16df6d2e",
		"name": "Mama"
	  },
	  "count": 674,
	  "senders": 102,
	  "receivers": 141,
	  "amount": 6255774892.337207,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ALTD",
		"address": "0x8929e9dbd2785e3ba16175e596cdd61520fee0d1",
		"name": "Altitude"
	  },
	  "count": 672,
	  "senders": 140,
	  "receivers": 167,
	  "amount": 7024053.837114744,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BBB",
		"address": "0xc43a652d9a7a936b6f2c4eb45505a84ea4e50f83",
		"name": "Bang Bang Bang"
	  },
	  "count": 671,
	  "senders": 88,
	  "receivers": 85,
	  "amount": 3887428.24485092,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Claim Rewards at https://abict.pro",
		"address": "0x6b15c3a0ece9a699790f5a1dc93aa99e59097b08",
		"name": "$ abict.pro"
	  },
	  "count": 669,
	  "senders": 1,
	  "receivers": 669,
	  "amount": 31921335.000000145,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE THREE",
		"address": "0x0b0b3dc6769f3aa3dbe596cc4f0ff67b3c5b23f9",
		"name": "Pepe III"
	  },
	  "count": 660,
	  "senders": 108,
	  "receivers": 133,
	  "amount": 684945159260.594,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PP",
		"address": "0xe82b35f7e864235718b7746a329b2e8df635d473",
		"name": "Poseidons Phallus"
	  },
	  "count": 659,
	  "senders": 106,
	  "receivers": 175,
	  "amount": 2027916835.9906623,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAIL",
		"address": "0xcffebe2381327ae285e4fd55d042de8c09d91050",
		"name": "$BAIL_MUNEY"
	  },
	  "count": 658,
	  "senders": 109,
	  "receivers": 150,
	  "amount": 3765910333279928.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MEVFree",
		"address": "0x1936c91190e901b7dd55229a574ae22b58ff498a",
		"name": "MEVFree"
	  },
	  "count": 657,
	  "senders": 99,
	  "receivers": 141,
	  "amount": 2577407.971395136,
	  "amount_usd": 761880.7886518886
	},
	{
	  "currency": {
		"symbol": "ELON",
		"address": "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3",
		"name": "Dogelon"
	  },
	  "count": 652,
	  "senders": 173,
	  "receivers": 245,
	  "amount": 16783810786975.973,
	  "amount_usd": 2280300.0369655825
	},
	{
	  "currency": {
		"symbol": "PEPE18+",
		"address": "0x572d87ddd01950538879fcb0cdef3ff515ccaf1e",
		"name": "Adult Pepe"
	  },
	  "count": 650,
	  "senders": 109,
	  "receivers": 180,
	  "amount": 113993991.48643214,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MIA",
		"address": "0xe9fcc6ffca488ac648db7e5d514db502eaa835e7",
		"name": "Milady Saga"
	  },
	  "count": 648,
	  "senders": 174,
	  "receivers": 248,
	  "amount": 791034026.2696137,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SAITAMA",
		"address": "0x930ae5999210724248b36265e8d3696128115946",
		"name": "HarryPotterRussellSonic1Inu"
	  },
	  "count": 646,
	  "senders": 106,
	  "receivers": 106,
	  "amount": 368626675.3972432,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPER",
		"address": "0x7e61765081b54bcb49da8410195abeb455f6cc6c",
		"name": "PEPE Racer"
	  },
	  "count": 646,
	  "senders": 106,
	  "receivers": 139,
	  "amount": 635004701.3656168,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYBITCOIN",
		"address": "0x9367559ec6db4b5201e53746ac3d986d5eae3c9f",
		"name": "HarryPotterObamaSonic10Inu"
	  },
	  "count": 641,
	  "senders": 136,
	  "receivers": 92,
	  "amount": 815336827994362.1,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Wojakians",
		"address": "0x21416efc90c7265e7550c7ae4bd63b15623908b6",
		"name": "Wojakians"
	  },
	  "count": 640,
	  "senders": 17,
	  "receivers": 88,
	  "amount": 640,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ЕTH",
		"address": "0xe3325bb98c2a64aedb805a4b98ee2770b3954993",
		"name": "Еthereum"
	  },
	  "count": 635,
	  "senders": 395,
	  "receivers": 527,
	  "amount": 12545.945134315882,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHEPE",
		"address": "0xd71c408eedf5dd1d5775e3e38db4cc8597d0733d",
		"name": "SHEPE"
	  },
	  "count": 633,
	  "senders": 80,
	  "receivers": 121,
	  "amount": 44099662.82900625,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$PEPEC",
		"address": "0xab1f5e06f453d3d28025a22bde74c3c221332df6",
		"name": "Pepe Club"
	  },
	  "count": 627,
	  "senders": 105,
	  "receivers": 144,
	  "amount": 647670388.7640291,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DYC",
		"address": "0x5dd3ab5309dc5611c3300820dc747aa422399d5b",
		"name": "Decenty"
	  },
	  "count": 624,
	  "senders": 83,
	  "receivers": 120,
	  "amount": 8887151978.012163,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DOB",
		"address": "0x0085d2a95873fbc951e28a8ae1d2f26bc60670dd",
		"name": "DeOrderBook"
	  },
	  "count": 620,
	  "senders": 139,
	  "receivers": 195,
	  "amount": 1000637208.4473848,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DDIV",
		"address": "0x908a00c141d619236c7cf1b4e351d081bf4f9800",
		"name": "Dividend"
	  },
	  "count": 619,
	  "senders": 96,
	  "receivers": 138,
	  "amount": 525668051.4049415,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SAND",
		"address": "0x3845badade8e6dff049820680d1f14bd3903a5d0",
		"name": "SAND"
	  },
	  "count": 601,
	  "senders": 263,
	  "receivers": 400,
	  "amount": 19365643.202281483,
	  "amount_usd": 6177576.136127263
	},
	{
	  "currency": {
		"symbol": "OCAI",
		"address": "0x4309e88d1d511f3764ee0f154cee98d783b61f09",
		"name": "Onchain AI Token"
	  },
	  "count": 600,
	  "senders": 168,
	  "receivers": 212,
	  "amount": 24440902.37152347,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIAR",
		"address": "0xbc1ba885e143c7e7372c510ead49bda9a2db6d1a",
		"name": "Shia Reflections"
	  },
	  "count": 592,
	  "senders": 130,
	  "receivers": 93,
	  "amount": 1014183381.9702458,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GTC",
		"address": "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
		"name": "Gitcoin"
	  },
	  "count": 589,
	  "senders": 293,
	  "receivers": 244,
	  "amount": 6025749.092015551,
	  "amount_usd": 5077556.262762082
	},
	{
	  "currency": {
		"symbol": "XShiba",
		"address": "0x1fae569e82f4b0469871f722a10a0fd2a81b81f2",
		"name": "XShiba Inu"
	  },
	  "count": 587,
	  "senders": 84,
	  "receivers": 145,
	  "amount": 12803824904.912956,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYTRUMP",
		"address": "0x354c8cda7e3b737d360513a0dc5abcee8ee1cea3",
		"name": "BABYTRUMP"
	  },
	  "count": 582,
	  "senders": 104,
	  "receivers": 110,
	  "amount": 31516602.23903799,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LINE",
		"address": "0x853b35838d6b71261849882865f324de9b24c820",
		"name": "LIQUILINE"
	  },
	  "count": 582,
	  "senders": 84,
	  "receivers": 114,
	  "amount": 5408882437.062737,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SG",
		"address": "0x75129434689ba4ee756770dabbb651b0d536b671",
		"name": "Shares Gram"
	  },
	  "count": 580,
	  "senders": 23,
	  "receivers": 260,
	  "amount": 3133964.153196049,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIABURN",
		"address": "0x958ec96f445306784237b72e5ee18f5726dde744",
		"name": "SHIABURN"
	  },
	  "count": 576,
	  "senders": 100,
	  "receivers": 91,
	  "amount": 1674698751.7778826,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CHZ",
		"address": "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
		"name": "chiliZ"
	  },
	  "count": 575,
	  "senders": 190,
	  "receivers": 279,
	  "amount": 365685908.32265145,
	  "amount_usd": 22370500.68119122
	},
	{
	  "currency": {
		"symbol": "WPEPE",
		"address": "0x102b71b9aeadde037f7fafc614c03e78feac96ff",
		"name": "Wrapped Pepe"
	  },
	  "count": 573,
	  "senders": 149,
	  "receivers": 206,
	  "amount": 718959762665.652,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE3",
		"address": "0x9a6f25438283ef2fb69799d1405c46a996e858ed",
		"name": "Pepe3.0"
	  },
	  "count": 572,
	  "senders": 62,
	  "receivers": 164,
	  "amount": 4147956525.540999,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BTC20",
		"address": "0xe86df1970055e9caee93dae9b7d5fd71595d0e18",
		"name": "Bitcoin20"
	  },
	  "count": 568,
	  "senders": 168,
	  "receivers": 216,
	  "amount": 269076.59619948984,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPPER",
		"address": "0x24abca46e6bf3e18b870f9f5cc1a361ece13c68d",
		"name": "Pepe GF"
	  },
	  "count": 568,
	  "senders": 93,
	  "receivers": 117,
	  "amount": 576897631146.1284,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIA2.0",
		"address": "0x2266612b9f396607651216741e9cf1c2a2df7e31",
		"name": "SHIA2.0"
	  },
	  "count": 566,
	  "senders": 13,
	  "receivers": 540,
	  "amount": 8830767705.71145,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LALA",
		"address": "0xd56b8a55b6a88814692450ba4c98b4b2e5e6b0c0",
		"name": "LALA"
	  },
	  "count": 564,
	  "senders": 161,
	  "receivers": 230,
	  "amount": 951594039505793.2,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIAW",
		"address": "0x8b0d7f34202e16a5222354b3e4c00afd0e154f23",
		"name": "Shibarium Wallet"
	  },
	  "count": 562,
	  "senders": 72,
	  "receivers": 140,
	  "amount": 3000004133901305.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ACID",
		"address": "0x580a2a018cf3000a8117673e4f658bf587cf513f",
		"name": "Feels Trippy Man"
	  },
	  "count": 558,
	  "senders": 92,
	  "receivers": 128,
	  "amount": 5843942469.19202,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$TECHS",
		"address": "0xb0d6db6a4e9c08a99371075e14ec35d14008dd84",
		"name": "TECHNOSWAP"
	  },
	  "count": 558,
	  "senders": 105,
	  "receivers": 101,
	  "amount": 1272054724.311609,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USDT",
		"address": "0x8c646a5bf8623062581f621d3e1b3d88d0b4af97",
		"name": "Tether USD"
	  },
	  "count": 555,
	  "senders": 426,
	  "receivers": 513,
	  "amount": 39058906636.720535,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OC",
		"address": "0xdcce728316f6be8c128077d1dbcd15c50bdc727d",
		"name": "OnlyChads"
	  },
	  "count": 554,
	  "senders": 118,
	  "receivers": 106,
	  "amount": 1841135866.7934222,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PepeB",
		"address": "0x876d284c222139ebcc98f607957647b199875845",
		"name": "Pepe Burn"
	  },
	  "count": 548,
	  "senders": 85,
	  "receivers": 163,
	  "amount": 4428112836.567113,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$daddyShia",
		"address": "0x566a45ef9f4a8eddd6cbbdfbe02c2c85efe3748c",
		"name": "DaddyShia"
	  },
	  "count": 548,
	  "senders": 87,
	  "receivers": 140,
	  "amount": 564825204.8634269,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0x2afb813363f9339bb9c7ab59c0d33f11de1bfaef",
		"name": "Uniswap V2"
	  },
	  "count": 547,
	  "senders": 129,
	  "receivers": 147,
	  "amount": 35122.766165242225,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$2PEPE",
		"address": "0x355763646387fe9851708394e34d877a4fd5c4d4",
		"name": "Two Pepe"
	  },
	  "count": 542,
	  "senders": 95,
	  "receivers": 127,
	  "amount": 114103392.29091986,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CHAD",
		"address": "0x6e7e08a7c501aa77da5f01758f3d3016176ad7ef",
		"name": "Chad Index"
	  },
	  "count": 540,
	  "senders": 17,
	  "receivers": 170,
	  "amount": 3145998287.3123994,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FMOON",
		"address": "0xb2e6aff194dc0df342a470bc90fd694869b406ae",
		"name": "FriendsMoon"
	  },
	  "count": 539,
	  "senders": 84,
	  "receivers": 141,
	  "amount": 4764760.727774896,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "STG",
		"address": "0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6",
		"name": "StargateToken"
	  },
	  "count": 535,
	  "senders": 238,
	  "receivers": 269,
	  "amount": 15916983.242102915,
	  "amount_usd": 8742152.661136214
	},
	{
	  "currency": {
		"symbol": "LIB_Dividend_Tracker",
		"address": "0xb923c66e5a80e8a55cf98ce98a58d9ef39940aa9",
		"name": "LIB_Dividend_Tracker"
	  },
	  "count": 533,
	  "senders": 165,
	  "receivers": 242,
	  "amount": 349577695.41582084,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MANA",
		"address": "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
		"name": "Decentraland MANA"
	  },
	  "count": 524,
	  "senders": 231,
	  "receivers": 349,
	  "amount": 20023457.120481145,
	  "amount_usd": 5983922.999435736
	},
	{
	  "currency": {
		"symbol": "REKT",
		"address": "0xc229f3fcbf3a382a3c5060d0078e095a8313c8a5",
		"name": "REKT"
	  },
	  "count": 520,
	  "senders": 117,
	  "receivers": 174,
	  "amount": 5191754462.748762,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0xa8a837e2bf0c37fef5c495951a0dfc33aaead57a",
		"name": "Uniswap V2"
	  },
	  "count": 518,
	  "senders": 60,
	  "receivers": 297,
	  "amount": 5121.7574369641925,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Laundering",
		"address": "0xcc14e30254afd29b6e468fe48c9d451f54c9456a",
		"name": "Laundering"
	  },
	  "count": 516,
	  "senders": 16,
	  "receivers": 178,
	  "amount": 137908242087969980,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "APEX",
		"address": "0x586e0cf578662b41f98ade2a2421a42ea4280317",
		"name": "APExCoin"
	  },
	  "count": 511,
	  "senders": 6,
	  "receivers": 504,
	  "amount": 822174777386.5494,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HOPPY",
		"address": "0x8c130499d33097d4d000d3332e1672f75b431543",
		"name": "Hoppy"
	  },
	  "count": 510,
	  "senders": 78,
	  "receivers": 64,
	  "amount": 207187543794899.38,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0x378b7133a55dd5971bd64cee061df326da90847c",
		"name": "Uniswap V2"
	  },
	  "count": 506,
	  "senders": 136,
	  "receivers": 153,
	  "amount": 36392.169859656875,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VOSTOK",
		"address": "0x6207be4bb192a1487e4117530b125e38eff0ed8a",
		"name": "Rocket Frog"
	  },
	  "count": 506,
	  "senders": 125,
	  "receivers": 171,
	  "amount": 4433201527.797023,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "YANGBOT",
		"address": "0xf2b56659d3c89710ece21463a914dd834bd6e6f8",
		"name": "Yangbot"
	  },
	  "count": 505,
	  "senders": 20,
	  "receivers": 148,
	  "amount": 34687733.16467978,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$0xS",
		"address": "0x456815812b3129a4389ea4d73e9706697cc91373",
		"name": "0xS"
	  },
	  "count": 505,
	  "senders": 99,
	  "receivers": 116,
	  "amount": 6334313.694016059,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PAXG",
		"address": "0x45804880de22913dafe09f4980848ece6ecbaf78",
		"name": "Paxos Gold"
	  },
	  "count": 504,
	  "senders": 135,
	  "receivers": 143,
	  "amount": 793.2179367211644,
	  "amount_usd": 1510212.7403323515
	},
	{
	  "currency": {
		"symbol": "SGETH",
		"address": "0x72e2f4830b9e45d52f80ac08cb2bec0fef72ed9c",
		"name": "Stargate Ether Vault"
	  },
	  "count": 504,
	  "senders": 5,
	  "receivers": 1,
	  "amount": 599.9994698890952,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOLANA 2.0",
		"address": "0x9e9e2791d2121e6bfa10ebbd39cd551649a08e54",
		"name": "BarbieCrashBandicootRFK777Inu"
	  },
	  "count": 503,
	  "senders": 27,
	  "receivers": 449,
	  "amount": 15852937047859920000,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "cbETH",
		"address": "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
		"name": "Coinbase Wrapped Staked ETH"
	  },
	  "count": 502,
	  "senders": 132,
	  "receivers": 248,
	  "amount": 26372.94175475487,
	  "amount_usd": 45467091.414808154
	},
	{
	  "currency": {
		"symbol": "KEEPER",
		"address": "0x7eeb4746d7cf45b864550c9e540aacdbf1b9884a",
		"name": "Keepers"
	  },
	  "count": 500,
	  "senders": 1,
	  "receivers": 219,
	  "amount": 4.78972e-12,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOL",
		"address": "0x5947f5068299b52a1288d56e7769fcbccc4a1f9e",
		"name": "Solana"
	  },
	  "count": 499,
	  "senders": 99,
	  "receivers": 121,
	  "amount": 2853768174.0187154,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "seedworld",
		"address": "0xfe2927e07c30da5db9222e9c2392c1b3c8ec3f45",
		"name": "Seed Pod"
	  },
	  "count": 499,
	  "senders": 1,
	  "receivers": 1,
	  "amount": 1.2475e-13,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BUYDIP",
		"address": "0x2f0701131a6947048740e9a0dd6c88a5bfdf9d07",
		"name": "BuyDip"
	  },
	  "count": 499,
	  "senders": 101,
	  "receivers": 248,
	  "amount": 455538093.8800668,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "KEKE",
		"address": "0x2e5aeb07914ac4de49ff9f31465e36f1e146674e",
		"name": "KEK"
	  },
	  "count": 498,
	  "senders": 69,
	  "receivers": 87,
	  "amount": 620264643479.8486,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "KISHU",
		"address": "0x4fb3c3013c911a2d45cd7825adc95bee1edd8dbc",
		"name": "Kishu Inu"
	  },
	  "count": 498,
	  "senders": 112,
	  "receivers": 141,
	  "amount": 5795102916.145157,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SG",
		"address": "0xf4b0b1cb7af6454e079cdd1d4ad544e545e7e6ed",
		"name": "Shares Gram"
	  },
	  "count": 496,
	  "senders": 46,
	  "receivers": 195,
	  "amount": 35229095549.29753,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RNDR",
		"address": "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
		"name": "Render Token"
	  },
	  "count": 493,
	  "senders": 203,
	  "receivers": 315,
	  "amount": 1767134.6081659652,
	  "amount_usd": 2469996.512117535
	},
	{
	  "currency": {
		"symbol": "SINO'S",
		"address": "0x99de4382f5dcfa8d726478cc1a7505719921191d",
		"name": "Sino's"
	  },
	  "count": 492,
	  "senders": 89,
	  "receivers": 107,
	  "amount": 108377330.00751221,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BPG",
		"address": "0x02bccaa803905b5643bac84c0bce5f2393c5d686",
		"name": "Bit Playground"
	  },
	  "count": 489,
	  "senders": 34,
	  "receivers": 169,
	  "amount": 370093835.20505726,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "wPEPE",
		"address": "0xb302408be65cb48e1d54593b6f7411598001daeb",
		"name": "Wrapped Pepe"
	  },
	  "count": 486,
	  "senders": 155,
	  "receivers": 176,
	  "amount": 5607251694078.003,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BRETT",
		"address": "0x80ee5c641a8ffc607545219a3856562f56427fe9",
		"name": "Brett"
	  },
	  "count": 484,
	  "senders": 151,
	  "receivers": 136,
	  "amount": 231532064.41518036,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V3-POS",
		"address": "0xc36442b4a4522e871399cd717abdd847ab11fe88",
		"name": "Uniswap V3 Positions NFT-V1"
	  },
	  "count": 482,
	  "senders": 27,
	  "receivers": 291,
	  "amount": 482,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "3.0Pepe",
		"address": "0xf440cfe71441c580c7cf9b2e8bd909673d8c5b11",
		"name": "3.0 Pepe"
	  },
	  "count": 481,
	  "senders": 79,
	  "receivers": 107,
	  "amount": 650799571.838108,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BLUR",
		"address": "0x5283d291dbcf85356a21ba090e6db59121208b44",
		"name": "Blur"
	  },
	  "count": 481,
	  "senders": 178,
	  "receivers": 142,
	  "amount": 49878872.279036544,
	  "amount_usd": 11063901.952225562
	},
	{
	  "currency": {
		"symbol": "ZETION",
		"address": "0xe6d965aec0e1baf475fc4ff0b378f814aaba4076",
		"name": "Zetion Protocol"
	  },
	  "count": 474,
	  "senders": 46,
	  "receivers": 165,
	  "amount": 12297677876418704,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0xafd54595986ede4976d6717fcead8b36978edc17",
		"name": "ETH"
	  },
	  "count": 474,
	  "senders": 144,
	  "receivers": 4,
	  "amount": 10000136.040000003,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "EPEP",
		"address": "0x4975c30c9d29a9f1942d68070aa814bfc8a60164",
		"name": "Inverse Pepe"
	  },
	  "count": 468,
	  "senders": 74,
	  "receivers": 114,
	  "amount": 5328737896.162816,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DEGEN",
		"address": "0x4743899248f0dc83806530a9131ca47dc463193e",
		"name": "DEGENESIS"
	  },
	  "count": 468,
	  "senders": 71,
	  "receivers": 104,
	  "amount": 4000003942516604,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SONICBOT",
		"address": "0xb167b290d172eb33e221309592df0c042ab9dcdd",
		"name": "SonicBOT"
	  },
	  "count": 466,
	  "senders": 138,
	  "receivers": 195,
	  "amount": 12243323.286429,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ETHF",
		"address": "0x730f8c56c709c5f5b4a6e91f98fa7a7c410e990d",
		"name": "Ether-Futures"
	  },
	  "count": 464,
	  "senders": 90,
	  "receivers": 96,
	  "amount": 155074686396188.9,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OLAS",
		"address": "0x0001a500a6b18995b03f44bb040a5ffc28e45cb0",
		"name": "Autonolas"
	  },
	  "count": 462,
	  "senders": 168,
	  "receivers": 180,
	  "amount": 1803061.4129765064,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USᎠT",
		"address": "0x31700257c8822c6bccd19076bbd438bb9322a93a",
		"name": "Τether USᎠ"
	  },
	  "count": 459,
	  "senders": 376,
	  "receivers": 431,
	  "amount": 30323857.463323,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPEpromax",
		"address": "0x8910b8f53983ed457ec6c74445d32c2b0050f381",
		"name": "PEPE PRO MAX"
	  },
	  "count": 458,
	  "senders": 79,
	  "receivers": 107,
	  "amount": 1440790386615782,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AXE",
		"address": "0x070e984fda37dd942f5c953f6b2375339adac308",
		"name": "AXE"
	  },
	  "count": 457,
	  "senders": 92,
	  "receivers": 101,
	  "amount": 78254.635470897,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HILO",
		"address": "0xbb9fd9fa4863c03c574007ff3370787b9ce65ff6",
		"name": "HILO"
	  },
	  "count": 455,
	  "senders": 90,
	  "receivers": 99,
	  "amount": 3775559.70382332,
	  "amount_usd": 538079.8857056774
	},
	{
	  "currency": {
		"symbol": "HDRN",
		"address": "0x3819f64f282bf135d62168c1e513280daf905e06",
		"name": "Hedron"
	  },
	  "count": 454,
	  "senders": 81,
	  "receivers": 135,
	  "amount": 665482601342.8633,
	  "amount_usd": 96583.8849437553
	},
	{
	  "currency": {
		"symbol": "CVX",
		"address": "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
		"name": "Convex Token"
	  },
	  "count": 451,
	  "senders": 145,
	  "receivers": 157,
	  "amount": 3737065.851221453,
	  "amount_usd": 10469482.729121504
	},
	{
	  "currency": {
		"symbol": "LOOKS",
		"address": "0xf4d2888d29d722226fafa5d9b24f9164c092421e",
		"name": "LooksRare Token"
	  },
	  "count": 445,
	  "senders": 97,
	  "receivers": 103,
	  "amount": 32622725.37797935,
	  "amount_usd": 2042929.404613856
	},
	{
	  "currency": {
		"symbol": "MLM",
		"address": "0x7f94cb5255f128dabad010cbbcc6d2181f65594c",
		"name": "Multi-level Marketing Network"
	  },
	  "count": 443,
	  "senders": 34,
	  "receivers": 149,
	  "amount": 527735800.6981843,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MEME",
		"address": "0x76c13c3251e4c9fd9b5516ffb9e8dab8eaaacf09",
		"name": "MEME INDEX"
	  },
	  "count": 441,
	  "senders": 60,
	  "receivers": 88,
	  "amount": 479882191.870716,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "AGIX",
		"address": "0x5b7533812759b45c2b44c19e320ba2cd2681b542",
		"name": "SingularityNET Token"
	  },
	  "count": 437,
	  "senders": 173,
	  "receivers": 296,
	  "amount": 7096340.32542051,
	  "amount_usd": 1258100.3785939475
	},
	{
	  "currency": {
		"symbol": "WAR",
		"address": "0xd48ada63c68c1b260abc4b39eda3a05ddb95e249",
		"name": "War Game Betting Token"
	  },
	  "count": 437,
	  "senders": 60,
	  "receivers": 94,
	  "amount": 51240513.4783154,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "NEXUS",
		"address": "0x0abd596070be270f04eb446128b3dc04969e7d29",
		"name": "Nexus Pro"
	  },
	  "count": 436,
	  "senders": 72,
	  "receivers": 126,
	  "amount": 22612275.5730136,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TRIN",
		"address": "0x195ac7d20a3d11895d2fe2f35b48fc2d1d0ee1b5",
		"name": "TRINGE"
	  },
	  "count": 435,
	  "senders": 63,
	  "receivers": 111,
	  "amount": 5000003544224802,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Error in symbol",
		"address": "0x094f40daebfadfcad221c4fa57aa11ec9d8bebe8",
		"name": "Error in name"
	  },
	  "count": 433,
	  "senders": 35,
	  "receivers": 123,
	  "amount": 0.004689640608397142,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ATOR",
		"address": "0x0f7b3f5a8fed821c5eb60049538a548db2d479ce",
		"name": "AirTor Protocol"
	  },
	  "count": 430,
	  "senders": 99,
	  "receivers": 104,
	  "amount": 563371.0335138437,
	  "amount_usd": 357459.85195679346
	},
	{
	  "currency": {
		"symbol": "VEGA",
		"address": "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e",
		"name": "VEGA"
	  },
	  "count": 428,
	  "senders": 92,
	  "receivers": 91,
	  "amount": 1381355.7572593747,
	  "amount_usd": 1408360.7324133897
	},
	{
	  "currency": {
		"symbol": "LinQPool_Dividend_Tracker",
		"address": "0x0221ab36bf4e25a5d7747ca40ed9f1567fecf829",
		"name": "LinQPool_Dividend_Tracker"
	  },
	  "count": 423,
	  "senders": 167,
	  "receivers": 212,
	  "amount": 185526328.90245005,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0xec5176eb6a58ecac9d9af59d590c0476403e1af1",
		"name": "ETH..."
	  },
	  "count": 421,
	  "senders": 162,
	  "receivers": 373,
	  "amount": 16504470.937233485,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TREAT",
		"address": "0xfbd5fd3f85e9f4c5e8b40eec9f8b8ab1caaa146b",
		"name": "Treat"
	  },
	  "count": 418,
	  "senders": 71,
	  "receivers": 80,
	  "amount": 97964021.73188268,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HOSHI",
		"address": "0x5362ca75aa3c0e714bc628296640c43dc5cb9ed6",
		"name": "Dejitaru Hoshi"
	  },
	  "count": 415,
	  "senders": 123,
	  "receivers": 118,
	  "amount": 222100239.48739725,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Error in symbol",
		"address": "0x37fcf91f9a01515fe36260690d5542b1fbf853dc",
		"name": "Error in name"
	  },
	  "count": 415,
	  "senders": 44,
	  "receivers": 130,
	  "amount": 0.5136503547883828,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PepeGains",
		"address": "0x8c44b722ede8d6cc9f7b2372cbe10a935e5092b1",
		"name": "PepeGains"
	  },
	  "count": 415,
	  "senders": 79,
	  "receivers": 138,
	  "amount": 38880896.34793091,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BUFFMILADY",
		"address": "0x4770b59b5d227e1578d5eee618312c41ce52493e",
		"name": "Buff Milady"
	  },
	  "count": 412,
	  "senders": 72,
	  "receivers": 103,
	  "amount": 49176045.945010655,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "USᎠT",
		"address": "0x44e5c7e1aed8aa794bcdd6e0b2850decdabcfe1a",
		"name": "Τether USᎠ"
	  },
	  "count": 412,
	  "senders": 318,
	  "receivers": 390,
	  "amount": 33820226.869557,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "STONKS",
		"address": "0xedf85191ecd2aa8be6e77322737aa71f1b5c700f",
		"name": "Stonks"
	  },
	  "count": 410,
	  "senders": 45,
	  "receivers": 130,
	  "amount": 1910018996755.1028,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DYDX",
		"address": "0x92d6c1e31e14520e676a687f0a93788b716beff5",
		"name": "dYdX"
	  },
	  "count": 408,
	  "senders": 157,
	  "receivers": 249,
	  "amount": 2890891.2222214835,
	  "amount_usd": 6204481.990468936
	},
	{
	  "currency": {
		"symbol": "DIETPEPE",
		"address": "0xb379cfa50b2a27d6f3f044a8d48dab4463170506",
		"name": "diet pepe"
	  },
	  "count": 408,
	  "senders": 38,
	  "receivers": 63,
	  "amount": 1556879606556.151,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE20",
		"address": "0x2adade226586286f71eaf5ed399a497d228bf859",
		"name": "PEPE20"
	  },
	  "count": 408,
	  "senders": 77,
	  "receivers": 45,
	  "amount": 20466213558454.24,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAZED",
		"address": "0x3ee4b152824b657644c7a9b50694787e80eb8f4a",
		"name": "Bazed Games"
	  },
	  "count": 407,
	  "senders": 86,
	  "receivers": 94,
	  "amount": 4082079.0808890467,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "COCO",
		"address": "0xcb50350ab555ed5d56265e096288536e8cac41eb",
		"name": "0xCoco"
	  },
	  "count": 407,
	  "senders": 60,
	  "receivers": 88,
	  "amount": 10892551.450558405,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "10KTF",
		"address": "0xe75ef1ec029c71c9db0f968e389331609312aa22",
		"name": "10KTF Combat Gear"
	  },
	  "count": 407,
	  "senders": 48,
	  "receivers": 67,
	  "amount": 1.163923535784586,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OMI",
		"address": "0xed35af169af46a02ee13b9d79eb57d6d68c1749e",
		"name": "OMI Token"
	  },
	  "count": 404,
	  "senders": 150,
	  "receivers": 183,
	  "amount": 876065601.7021339,
	  "amount_usd": 914733.8079213895
	},
	{
	  "currency": {
		"symbol": "0KN",
		"address": "0x4594cffbfc09bc5e7ecf1c2e1c1e24f0f7d29036",
		"name": "Zero Knowledge Network"
	  },
	  "count": 404,
	  "senders": 82,
	  "receivers": 107,
	  "amount": 663552107.4567331,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SAINT",
		"address": "0x3d5fa1cf7d356474f72c8cb24f7a6117b40f8c40",
		"name": "Saintbot"
	  },
	  "count": 400,
	  "senders": 68,
	  "receivers": 93,
	  "amount": 114352.96481769274,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MAGICPEPE",
		"address": "0xa31a589581fcc120dacd438416d59f336e17eb42",
		"name": "MagicPepeMoney"
	  },
	  "count": 400,
	  "senders": 117,
	  "receivers": 168,
	  "amount": 7580860133.153584,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VOW",
		"address": "0x1bbf25e71ec48b84d773809b4ba55b6f4be946fb",
		"name": "Vow"
	  },
	  "count": 400,
	  "senders": 141,
	  "receivers": 167,
	  "amount": 2221482.626369147,
	  "amount_usd": 1377349.4553392236
	},
	{
	  "currency": {
		"symbol": "NONE",
		"address": "0x903ff0ba636e32de1767a4b5eeb55c155763d8b7",
		"name": "None Trading"
	  },
	  "count": 396,
	  "senders": 97,
	  "receivers": 93,
	  "amount": 60622.71041222376,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Bcash",
		"address": "0xb519a3e46d43c2ab98a7cabc6bbf00df491438e6",
		"name": "BulletCash"
	  },
	  "count": 396,
	  "senders": 52,
	  "receivers": 64,
	  "amount": 482146179.5865767,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$LOOT",
		"address": "0xb478c6245e3d85d6ec3486b62ea872128d562541",
		"name": "LootBot"
	  },
	  "count": 395,
	  "senders": 54,
	  "receivers": 46,
	  "amount": 463254.7478910865,
	  "amount_usd": 249863.08118113803
	},
	{
	  "currency": {
		"symbol": "USDC",
		"address": "0x3b17764771982f35db99ecdd5fb0e8db854896ce",
		"name": "USD Coin"
	  },
	  "count": 395,
	  "senders": 284,
	  "receivers": 395,
	  "amount": 16209709.324218,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "REFLEX",
		"address": "0x2f09757b222642c649f1f9d80798b0123fa18ba9",
		"name": "Reflex Staking Bot"
	  },
	  "count": 393,
	  "senders": 85,
	  "receivers": 115,
	  "amount": 898931.1410834934,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PUMLx",
		"address": "0x8c088775e4139af116ac1fa6f281bbf71e8c1c73",
		"name": "PUMLx"
	  },
	  "count": 391,
	  "senders": 23,
	  "receivers": 231,
	  "amount": 830243.9172348665,
	  "amount_usd": 9353.029706280133
	},
	{
	  "currency": {
		"symbol": "PEPE0",
		"address": "0x8e4523e4839123571a0ede28cee0ea6847c731a7",
		"name": "Pepe 0"
	  },
	  "count": 391,
	  "senders": 120,
	  "receivers": 153,
	  "amount": 7210985031.737093,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "crvUSD",
		"address": "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e",
		"name": "Curve.Fi USD Stablecoin"
	  },
	  "count": 389,
	  "senders": 92,
	  "receivers": 87,
	  "amount": 23011281.998410862,
	  "amount_usd": 22979082.153224442
	},
	{
	  "currency": {
		"symbol": "WOJAK",
		"address": "0x1268a45d217573ee53e8c40db0f3195e8c785ac0",
		"name": "Wojak"
	  },
	  "count": 387,
	  "senders": 118,
	  "receivers": 158,
	  "amount": 643420847.7477355,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0xbe0dc39bc50cda56c2db71ac7737b0f19d006c1a",
		"name": "Uniswap V2"
	  },
	  "count": 387,
	  "senders": 17,
	  "receivers": 29,
	  "amount": 49215.43312354384,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PBURN",
		"address": "0x6d8c43a07af0c9ece2acf6f5c918f7935efcc66f",
		"name": "PepeBurn"
	  },
	  "count": 384,
	  "senders": 63,
	  "receivers": 79,
	  "amount": 5455480.677093409,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MONK",
		"address": "0xaa35cc8660cc26d86913e771c141fd6eeb5ff29e",
		"name": "Monk"
	  },
	  "count": 383,
	  "senders": 61,
	  "receivers": 98,
	  "amount": 27477474749.64894,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Visit https://avETH.tech to claim rewards",
		"address": "0xf5e6c233771efffe6d9743500200847027c69ca7",
		"name": "avETH.tech"
	  },
	  "count": 381,
	  "senders": 381,
	  "receivers": 374,
	  "amount": 528097,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Bunny Buddies",
		"address": "0x91cc3844b8271337679f8c00cb2d238886917d40",
		"name": "Bunny Buddies"
	  },
	  "count": 380,
	  "senders": 17,
	  "receivers": 4,
	  "amount": 380,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DJX",
		"address": "0xbd14c2204499e69f683cf3596d99ffe6b095d8ca",
		"name": "DJX6900"
	  },
	  "count": 379,
	  "senders": 27,
	  "receivers": 148,
	  "amount": 3526752326.0584188,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PepeR",
		"address": "0xe227a332610baf323456ff38852b57830c3d6365",
		"name": "Pepe Reflections"
	  },
	  "count": 379,
	  "senders": 98,
	  "receivers": 68,
	  "amount": 1154844276922.443,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ILV",
		"address": "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
		"name": "Illuvium"
	  },
	  "count": 377,
	  "senders": 145,
	  "receivers": 204,
	  "amount": 38173.87335196021,
	  "amount_usd": 1619957.9294806998
	},
	{
	  "currency": {
		"symbol": "BEN",
		"address": "0x370c93a5ec5ae326a75b423c2103cff3be198d66",
		"name": "BEN"
	  },
	  "count": 374,
	  "senders": 62,
	  "receivers": 75,
	  "amount": 5744855.49552975,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VOCARE",
		"address": "0x4eb5124d04227f1aab771a37e131e62f17c4ffdc",
		"name": "Vocare ex Machina"
	  },
	  "count": 372,
	  "senders": 81,
	  "receivers": 78,
	  "amount": 3556040.899555993,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "1Pepe",
		"address": "0x0b23e231a405872c3be0d54b0c06b4ab4fcd9b35",
		"name": "One Pepe"
	  },
	  "count": 371,
	  "senders": 74,
	  "receivers": 85,
	  "amount": 4.515136260252398,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "IMX",
		"address": "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
		"name": "Immutable X"
	  },
	  "count": 369,
	  "senders": 180,
	  "receivers": 236,
	  "amount": 29154213.51678984,
	  "amount_usd": 16305226.681853902
	},
	{
	  "currency": {
		"symbol": "BBNE",
		"address": "0x82929ed6ce74a8cc0f910a7b54acfcf5748b863b",
		"name": "Bunny Buddies New Era"
	  },
	  "count": 365,
	  "senders": 1,
	  "receivers": 14,
	  "amount": 365,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GAMEX",
		"address": "0x9ad49eb02468d163ab30ffd77d5ea66e3ec92d2f",
		"name": "Game Exchange"
	  },
	  "count": 365,
	  "senders": 44,
	  "receivers": 105,
	  "amount": 2311355073.425986,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ENT",
		"address": "0x675ababd3a210566a5e213547523b740be80041a",
		"name": "Entropy"
	  },
	  "count": 364,
	  "senders": 150,
	  "receivers": 223,
	  "amount": 97580.99999999997,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LDO",
		"address": "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
		"name": "Lido DAO Token"
	  },
	  "count": 363,
	  "senders": 150,
	  "receivers": 207,
	  "amount": 2570565.6909673605,
	  "amount_usd": 4077026.149798534
	},
	{
	  "currency": {
		"symbol": "PEPEX",
		"address": "0x8bccd69b41d11c79b1bdcd1da8963c659e21c539",
		"name": "PEPE X"
	  },
	  "count": 363,
	  "senders": 63,
	  "receivers": 83,
	  "amount": 438701568.5235984,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "똥코인",
		"address": "0x4208aa4d7a9a10f4f8bb7f6400c1b2161d946969",
		"name": "똥코인"
	  },
	  "count": 363,
	  "senders": 63,
	  "receivers": 73,
	  "amount": 313072891732164.06,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DUB",
		"address": "0x75ce16d11b83605aa039d40d7d846ff23064fb65",
		"name": "DUBX"
	  },
	  "count": 359,
	  "senders": 49,
	  "receivers": 70,
	  "amount": 26527925503143.42,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "wPEPE",
		"address": "0xa55c5f7da970381509b1986429199e9805056642",
		"name": "Wolf of PEPE Street"
	  },
	  "count": 356,
	  "senders": 51,
	  "receivers": 78,
	  "amount": 428236005.36302567,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "WOO",
		"address": "0x4691937a7508860f876c9c0a2a617e7d9e945d4b",
		"name": "Wootrade Network"
	  },
	  "count": 352,
	  "senders": 87,
	  "receivers": 123,
	  "amount": 19356389.76260539,
	  "amount_usd": 3218242.7429728145
	},
	{
	  "currency": {
		"symbol": "ALAMUT",
		"address": "0xbbeee0261da0c659f39b429339115639ec5ba00f",
		"name": "Alamut"
	  },
	  "count": 351,
	  "senders": 34,
	  "receivers": 79,
	  "amount": 118643786530.85631,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LADYS",
		"address": "0x12970e6868f88f6557b76120662c1b3e50a646bf",
		"name": "Milady"
	  },
	  "count": 350,
	  "senders": 93,
	  "receivers": 131,
	  "amount": 29346231305881.34,
	  "amount_usd": 946226.5610763929
	},
	{
	  "currency": {
		"symbol": "SONICHU",
		"address": "0xd2c1caea4daca6df77fae7b27b99a0a242270806",
		"name": "Sonichu"
	  },
	  "count": 347,
	  "senders": 55,
	  "receivers": 86,
	  "amount": 2341881777575999.5,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$0xGas",
		"address": "0x994a258c7dec633b5b15376f850d5ea701179e79",
		"name": "0xGasless"
	  },
	  "count": 347,
	  "senders": 55,
	  "receivers": 85,
	  "amount": 8968896.264375916,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x29aa4b12fe2e40c3b11e84977b6c7c23d37a6836",
		"name": "Perky Exotic Promiscuous Escorts"
	  },
	  "count": 344,
	  "senders": 60,
	  "receivers": 80,
	  "amount": 50049714851.66582,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LM",
		"address": "0xc064f4f215b6a1e4e7f39bd8530c4de0fc43ee9d",
		"name": "LeisureMeta"
	  },
	  "count": 344,
	  "senders": 8,
	  "receivers": 338,
	  "amount": 5787972.902001001,
	  "amount_usd": 104370.18113952875
	},
	{
	  "currency": {
		"symbol": "PEPEJR",
		"address": "0xcb5f314cc82445d2b852ca7e186a2aaf1376d3fb",
		"name": "PEPEJR"
	  },
	  "count": 343,
	  "senders": 41,
	  "receivers": 84,
	  "amount": 3967214538.030109,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LPS_Dividend",
		"address": "0xa53238b19008bce9c8cd342b44881412fec63bd6",
		"name": "LPS Dividend"
	  },
	  "count": 342,
	  "senders": 69,
	  "receivers": 244,
	  "amount": 168032933.803818,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ENJ",
		"address": "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
		"name": "Enjin Coin"
	  },
	  "count": 341,
	  "senders": 193,
	  "receivers": 226,
	  "amount": 8383217.053323403,
	  "amount_usd": 2027646.0453726891
	},
	{
	  "currency": {
		"symbol": "WindowsLiquidity_Dividend_Tracker",
		"address": "0x17ed74f7ab6738bcbcfba5e86c1af8e045eaab09",
		"name": "WindowsLiquidity_Dividend_Tracker"
	  },
	  "count": 340,
	  "senders": 92,
	  "receivers": 214,
	  "amount": 151533287.13507327,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TSUKA",
		"address": "0xec4818c017f2ec402708cc5841d69c2273a8ae66",
		"name": "Dejitaru Tsuka"
	  },
	  "count": 340,
	  "senders": 52,
	  "receivers": 69,
	  "amount": 4974798713.19351,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "WSM",
		"address": "0xb62e45c3df611dce236a6ddc7a493d79f9dfadef",
		"name": "Wall Street Memes"
	  },
	  "count": 340,
	  "senders": 1,
	  "receivers": 1,
	  "amount": 4895560.999999999,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "₿",
		"address": "0xe4efdd2eb216a4620cfa55c5cc67bd09dc64ff24",
		"name": "⠀⠀⠀⠀⠀??⠀⠀⠀??\n⠀⠀⠀⠀⠀??⠀⠀⠀??\n???????????\n????????????\n?????????????\n⠀⠀⠀⠀⠀???⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀???\n⠀⠀⠀⠀⠀???⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀???\n⠀⠀⠀⠀⠀???⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀???\n⠀⠀⠀⠀⠀???⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀..."
	  },
	  "count": 338,
	  "senders": 42,
	  "receivers": 61,
	  "amount": 16799666.372974932,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Dubbz",
		"address": "0x38029c62dfa30d9fd3cadf4c64e9b2ab21dbda17",
		"name": "Dubbz"
	  },
	  "count": 337,
	  "senders": 88,
	  "receivers": 134,
	  "amount": 344753.60831206775,
	  "amount_usd": 781850.0982716166
	},
	{
	  "currency": {
		"symbol": "LinqB",
		"address": "0x2ce2373c62ce237fd342ba1088d15053a6423a5a",
		"name": "LinqBot"
	  },
	  "count": 336,
	  "senders": 51,
	  "receivers": 76,
	  "amount": 477814850.8649551,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEEPLE",
		"address": "0xfbd6950beb3e30e2908f094bb97db75e40577a47",
		"name": "Pepe Community"
	  },
	  "count": 335,
	  "senders": 31,
	  "receivers": 127,
	  "amount": 2247454146.9212527,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "NEW LADYS",
		"address": "0xfe6d7994279d00234c2cba7652745033e04cf2c2",
		"name": "NEW MILADY"
	  },
	  "count": 334,
	  "senders": 41,
	  "receivers": 93,
	  "amount": 3845202.2054699175,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "JASMY",
		"address": "0x7420b4b9a0110cdc71fb720908340c03f9bc03ec",
		"name": "JasmyCoin"
	  },
	  "count": 331,
	  "senders": 138,
	  "receivers": 222,
	  "amount": 2848455480.190814,
	  "amount_usd": 9584055.5671638
	},
	{
	  "currency": {
		"symbol": "ARKM",
		"address": "0x6e2a43be0b1d33b726f0ca3b8de60b3482b8b050",
		"name": "Arkham"
	  },
	  "count": 329,
	  "senders": 73,
	  "receivers": 259,
	  "amount": 1612127.4311724158,
	  "amount_usd": 601042.2582813833
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0x336510c982c9b5ccd4077b8206f7801adad021ab",
		"name": "ETH..."
	  },
	  "count": 326,
	  "senders": 118,
	  "receivers": 301,
	  "amount": 7.237005577332263e+57,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": ":ZKT:",
		"address": "0x76fca1adb104770b38581b64d55e67fa5a0f3966",
		"name": "ZkTsunami"
	  },
	  "count": 325,
	  "senders": 95,
	  "receivers": 116,
	  "amount": 387693.766759024,
	  "amount_usd": 224479.41870288938
	},
	{
	  "currency": {
		"symbol": "KSHIA",
		"address": "0x29027ffa14e2979a9f02af776a29467e4ba1a72d",
		"name": "King Shia"
	  },
	  "count": 324,
	  "senders": 59,
	  "receivers": 84,
	  "amount": 467380882.69366765,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "bERN",
		"address": "0x8994fa21c4d3d77e1a56b1135a4ccdef5adf6d7d",
		"name": "Burn2Earn"
	  },
	  "count": 324,
	  "senders": 36,
	  "receivers": 118,
	  "amount": 278241628.503327,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SNX",
		"address": "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
		"name": "Synthetix Network Token"
	  },
	  "count": 323,
	  "senders": 126,
	  "receivers": 185,
	  "amount": 7676403.717142171,
	  "amount_usd": 16214635.902726352
	},
	{
	  "currency": {
		"symbol": "OBTP",
		"address": "0xb352aa4e3e5131de4bbcbe68f7ede2e7cbe497bc",
		"name": "Obama  Trump"
	  },
	  "count": 319,
	  "senders": 6,
	  "receivers": 244,
	  "amount": 638970001479.4185,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SWEET",
		"address": "0x95b60c98b819903d4d4c103a4f883d9dbf2203da",
		"name": "Sweet Coin"
	  },
	  "count": 318,
	  "senders": 50,
	  "receivers": 79,
	  "amount": 5716700894.141685,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HANDZ",
		"address": "0x8494aee22e0db34daa1e8d6829d85710357be9f7",
		"name": "HANDZ"
	  },
	  "count": 318,
	  "senders": 79,
	  "receivers": 56,
	  "amount": 26695760.738328215,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAND",
		"address": "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55",
		"name": "BandToken"
	  },
	  "count": 318,
	  "senders": 86,
	  "receivers": 125,
	  "amount": 3767270.796222259,
	  "amount_usd": 4081665.8391879485
	},
	{
	  "currency": {
		"symbol": "FOX",
		"address": "0xc770eefad204b5180df6a14ee197d99d808ee52d",
		"name": "FOX"
	  },
	  "count": 317,
	  "senders": 68,
	  "receivers": 87,
	  "amount": 47452295.80212124,
	  "amount_usd": 1280197.6336470137
	},
	{
	  "currency": {
		"symbol": "XBETS",
		"address": "0xc1d86892365a057f9f71215bd8886580e2315800",
		"name": "XBets"
	  },
	  "count": 317,
	  "senders": 60,
	  "receivers": 74,
	  "amount": 3477742798.155845,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOS",
		"address": "0xf17b77787b2b7842acfe0fe1969855cca2595af9",
		"name": "Social Ordinance Saga"
	  },
	  "count": 316,
	  "senders": 30,
	  "receivers": 119,
	  "amount": 439472186.36683893,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HYPES",
		"address": "0xc56560484da2f69922d1b6a078aa29ca3efd79c3",
		"name": "Hypesync.Finance"
	  },
	  "count": 315,
	  "senders": 80,
	  "receivers": 201,
	  "amount": 3162158398.162987,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYPANDA",
		"address": "0x165607721ed8a47c0215a73664956ca41348852f",
		"name": "Baby Panda"
	  },
	  "count": 315,
	  "senders": 42,
	  "receivers": 92,
	  "amount": 5000003400711234,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$HOLA",
		"address": "0x5bffe8ddff21ca52d8371b14a6c39d6ae3c5d2c7",
		"name": "Hola Token"
	  },
	  "count": 314,
	  "senders": 103,
	  "receivers": 102,
	  "amount": 1463144087.9100723,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SDEX",
		"address": "0x5de8ab7e27f6e7a1fff3e5b337584aa43961beef",
		"name": "SmarDex Token"
	  },
	  "count": 312,
	  "senders": 73,
	  "receivers": 86,
	  "amount": 1591541405.0592637,
	  "amount_usd": 12873465.741544535
	},
	{
	  "currency": {
		"symbol": "TECH",
		"address": "0xb968c77bd87ce04d98c76f53aa25f8c210829b45",
		"name": "TECH"
	  },
	  "count": 312,
	  "senders": 59,
	  "receivers": 72,
	  "amount": 203661463024252.62,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "REPLICATOR",
		"address": "0x13f56d5d6193ee95f094fe9448cbbd783df95498",
		"name": "KAIJU ORIGINS: The Journals of Stod - Replicator"
	  },
	  "count": 310,
	  "senders": 3,
	  "receivers": 250,
	  "amount": 310,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPES",
		"address": "0xfadebc18ccc63edb8eee56d73e7d1c29a7cc2ed2",
		"name": "Pepe Shares"
	  },
	  "count": 310,
	  "senders": 57,
	  "receivers": 66,
	  "amount": 5486556.053384688,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "summer23",
		"address": "0x7cb3208c31876a3ae5bd525899c3085c2c5eda29",
		"name": "2023 Summer Release GA²"
	  },
	  "count": 308,
	  "senders": 9,
	  "receivers": 305,
	  "amount": 308,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MEOW",
		"address": "0x011db514f893d0b62a547bffd6b0cacd14d51955",
		"name": "Meow Protocol"
	  },
	  "count": 308,
	  "senders": 39,
	  "receivers": 100,
	  "amount": 1395656023920932900,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "TOADS",
		"address": "0x8f393e46ac410118fd892011b1432bb7d0fd1a54",
		"name": "Toad Friends"
	  },
	  "count": 308,
	  "senders": 7,
	  "receivers": 4,
	  "amount": 308,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x29072cbd26ca236eed7498eadee7f183a03b2049",
		"name": "Pepe"
	  },
	  "count": 306,
	  "senders": 3,
	  "receivers": 4,
	  "amount": 6169713183.840318,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Linq_Dividend_Tracker",
		"address": "0x9dd13eb913bf6bb282841b1ef6b1bf5b40c606a4",
		"name": "Linq_Dividend_Tracker"
	  },
	  "count": 306,
	  "senders": 93,
	  "receivers": 135,
	  "amount": 251388298.96902996,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "rETH",
		"address": "0xae78736cd615f374d3085123a210448e74fc6393",
		"name": "Rocket Pool ETH"
	  },
	  "count": 306,
	  "senders": 115,
	  "receivers": 137,
	  "amount": 7544.128095555729,
	  "amount_usd": 13471077.336779438
	},
	{
	  "currency": {
		"symbol": "pepecoin",
		"address": "0xa9e8acf069c58aec8825542845fd754e41a9489a",
		"name": "pepeCoin"
	  },
	  "count": 305,
	  "senders": 78,
	  "receivers": 130,
	  "amount": 15570337.486693244,
	  "amount_usd": 396827.28551868966
	},
	{
	  "currency": {
		"symbol": "RPL",
		"address": "0xd33526068d116ce69f19a9ee46f0bd304f21a51f",
		"name": "Rocket Pool Protocol"
	  },
	  "count": 305,
	  "senders": 118,
	  "receivers": 115,
	  "amount": 741435.8788224367,
	  "amount_usd": 16990583.03477601
	},
	{
	  "currency": {
		"symbol": "DMT",
		"address": "0x0b7f0e51cd1739d6c96982d55ad8fa634dd43a9c",
		"name": "DMT"
	  },
	  "count": 304,
	  "senders": 55,
	  "receivers": 66,
	  "amount": 70171.68365087599,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOP",
		"address": "0xca954376fad888e5112983340ceb44a95b7b92f2",
		"name": "Son Of Pepe"
	  },
	  "count": 304,
	  "senders": 54,
	  "receivers": 71,
	  "amount": 613631296.428035,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "MIXCOIN",
		"address": "0xb3a58eb551b5f80ec70b7f69ab7b664453271412",
		"name": "Mixaverse"
	  },
	  "count": 304,
	  "senders": 103,
	  "receivers": 39,
	  "amount": 10242618.915414782,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BPD",
		"address": "0xc81b0d02393a956234e24564805a896f14ad1250",
		"name": "Beautiful Princess Disorder"
	  },
	  "count": 303,
	  "senders": 93,
	  "receivers": 106,
	  "amount": 3530447625.039154,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "1INCH",
		"address": "0x111111111117dc0aa78b770fa6a738034120c302",
		"name": "1INCH Token"
	  },
	  "count": 300,
	  "senders": 148,
	  "receivers": 204,
	  "amount": 5092403.284636668,
	  "amount_usd": 1260279.3438869729
	},
	{
	  "currency": {
		"symbol": "ZTZ",
		"address": "0xc4200952f148a7388c88d5edcf1cb95826dddb1f",
		"name": "ZtrendZ"
	  },
	  "count": 300,
	  "senders": 1,
	  "receivers": 1,
	  "amount": 4.515e-14,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FINALE",
		"address": "0xc7a2572fa8fdb0f7e81d6d3c4e3ccf78fb0dc374",
		"name": "Bens Finale"
	  },
	  "count": 299,
	  "senders": 44,
	  "receivers": 37,
	  "amount": 10169462884.461935,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYXRP",
		"address": "0xb96cc32f9667a79f32138381dcee810685d5ceb4",
		"name": "BabyHarryPotterObamaPacMan8Inu"
	  },
	  "count": 299,
	  "senders": 58,
	  "receivers": 56,
	  "amount": 5928668075.9819,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEAR",
		"address": "0x5dcd6272c3cbb250823f0b7e6c618bce11b21f90",
		"name": "Pear Swap"
	  },
	  "count": 297,
	  "senders": 55,
	  "receivers": 62,
	  "amount": 3430637.774293041,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FMP",
		"address": "0x353ba450549e86d9df0d6cc1ef6796ee62caacc9",
		"name": "Futuristic Matrix Punks 2023"
	  },
	  "count": 296,
	  "senders": 2,
	  "receivers": 14,
	  "amount": 296,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "COTI",
		"address": "0xddb3422497e61e13543bea06989c0789117555c5",
		"name": "COTI Token"
	  },
	  "count": 296,
	  "senders": 140,
	  "receivers": 167,
	  "amount": 6896648.421666024,
	  "amount_usd": 265620.3200677084
	},
	{
	  "currency": {
		"symbol": "DEAD",
		"address": "0xc2fc9adeffc2cf41f12d76ae9eb515289c4cfa6d",
		"name": "DEAD COIN"
	  },
	  "count": 294,
	  "senders": 64,
	  "receivers": 67,
	  "amount": 520914625320.9776,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RFDAO",
		"address": "0x14f525bc87321b0c570da6e6b803058d2cb86960",
		"name": "RFDAO Coin"
	  },
	  "count": 293,
	  "senders": 114,
	  "receivers": 132,
	  "amount": 658372420.6645265,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RLY",
		"address": "0xf1f955016ecbcd7321c7266bccfb96c68ea5e49b",
		"name": "Rally"
	  },
	  "count": 292,
	  "senders": 70,
	  "receivers": 86,
	  "amount": 268516594.75044817,
	  "amount_usd": 2085089.7255035553
	},
	{
	  "currency": {
		"symbol": "PEMI",
		"address": "0xc40bfe24724f1c5d54c8d1158a42ee86f0e753a1",
		"name": "Pepe Milady"
	  },
	  "count": 291,
	  "senders": 39,
	  "receivers": 88,
	  "amount": 26520583399967120,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FET",
		"address": "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85",
		"name": "Fetch"
	  },
	  "count": 291,
	  "senders": 123,
	  "receivers": 191,
	  "amount": 17528221.890734464,
	  "amount_usd": 3601876.887764513
	},
	{
	  "currency": {
		"symbol": "SHIB",
		"address": "0xfcaf0e4498e78d65526a507360f755178b804ba8",
		"name": "NicCageWaluigiElmo42069Inu"
	  },
	  "count": 290,
	  "senders": 95,
	  "receivers": 94,
	  "amount": 256300112.20124695,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RAVEN",
		"address": "0x43af0944b34ad466dcea7fc8f77aafc6a4ec70fa",
		"name": "RavenFund"
	  },
	  "count": 290,
	  "senders": 83,
	  "receivers": 64,
	  "amount": 2176702.156754576,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FXS",
		"address": "0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0",
		"name": "Frax Share"
	  },
	  "count": 290,
	  "senders": 155,
	  "receivers": 153,
	  "amount": 449508.4381457612,
	  "amount_usd": 2667831.221695604
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0x3af45bb3a18f673e68885df517e60a17b1dbef56",
		"name": "Uniswap V2"
	  },
	  "count": 288,
	  "senders": 1,
	  "receivers": 1,
	  "amount": 271.4196814285667,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SCROTO",
		"address": "0x7115a8ecc11336e594618ef85be0b920dfe205d3",
		"name": "Scroto Schizos 10Neko"
	  },
	  "count": 288,
	  "senders": 7,
	  "receivers": 26,
	  "amount": 288,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "XRP",
		"address": "0xc895ddaf229a06532c5de4a2336c6902ce9f049f",
		"name": "Ripple"
	  },
	  "count": 287,
	  "senders": 98,
	  "receivers": 138,
	  "amount": 1521222259.3422108,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE1.5",
		"address": "0xb034850fdeebb93c6520607ffb946b0bf86f21e4",
		"name": "Pepe 1.5"
	  },
	  "count": 284,
	  "senders": 48,
	  "receivers": 57,
	  "amount": 1987663649.2964942,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DEP",
		"address": "0x1a3496c18d558bd9c6c8f609e1b129f67ab08163",
		"name": "DEAPCOIN"
	  },
	  "count": 284,
	  "senders": 71,
	  "receivers": 176,
	  "amount": 1806086848.2944515,
	  "amount_usd": 2119414.6977957217
	},
	{
	  "currency": {
		"symbol": "Scout",
		"address": "0x3ad9269200dfd3b290180d6e09b882317c3a580d",
		"name": "SocialScout"
	  },
	  "count": 284,
	  "senders": 86,
	  "receivers": 128,
	  "amount": 4200295.2625298,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DUST",
		"address": "0xb5b1b659da79a2507c27aad509f15b4874edc0cc",
		"name": "DUST Protocol"
	  },
	  "count": 283,
	  "senders": 131,
	  "receivers": 120,
	  "amount": 141549.498138443,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BABYRLB",
		"address": "0x1900321b1061fcfb3c281d63b532c83389c20150",
		"name": "Baby Rollbit"
	  },
	  "count": 282,
	  "senders": 37,
	  "receivers": 69,
	  "amount": 3361521475.670462,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ADD",
		"address": "0x2481afbfab4df3063daa3b7d2dd525f659f6e387",
		"name": "Addiction Bets"
	  },
	  "count": 282,
	  "senders": 41,
	  "receivers": 91,
	  "amount": 3503921.4433601396,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BAL",
		"address": "0xba100000625a3754423978a60c9317c58a424e3d",
		"name": "Balancer"
	  },
	  "count": 281,
	  "senders": 121,
	  "receivers": 136,
	  "amount": 1030613.8652760437,
	  "amount_usd": 3554164.1815551547
	},
	{
	  "currency": {
		"symbol": "BCGBP",
		"address": "0xa3d80770f433cdd517fe8e24ac02a10ea8b469f9",
		"name": "BYTE CITY Genesis Body Part Token"
	  },
	  "count": 280,
	  "senders": 84,
	  "receivers": 19,
	  "amount": 3.47594e-13,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPEC",
		"address": "0x46ace0c9cadf4e161ef341e69758528cf76745de",
		"name": "Pepe Classic"
	  },
	  "count": 280,
	  "senders": 81,
	  "receivers": 42,
	  "amount": 98669800.93821652,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DEGEN",
		"address": "0xd060e09cbc5de2c474499a0bd5323508f57f1ae6",
		"name": "de-genius"
	  },
	  "count": 280,
	  "senders": 63,
	  "receivers": 57,
	  "amount": 217757.71819081655,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "OGPEPE",
		"address": "0xcf254af42e8ad7a041cc79038146640e94557145",
		"name": "OG PEPE"
	  },
	  "count": 277,
	  "senders": 44,
	  "receivers": 73,
	  "amount": 51813366014.15983,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BADGER",
		"address": "0x3472a5a71965499acd81997a54bba8d852c6e53d",
		"name": "Badger"
	  },
	  "count": 276,
	  "senders": 105,
	  "receivers": 67,
	  "amount": 764578.1556752047,
	  "amount_usd": 1538729.3554169554
	},
	{
	  "currency": {
		"symbol": "WLD",
		"address": "0x163f8c2467924be0ae7b5347228cabf260318753",
		"name": "Worldcoin"
	  },
	  "count": 275,
	  "senders": 102,
	  "receivers": 118,
	  "amount": 1304811.0557521007,
	  "amount_usd": 1599801.3869289965
	},
	{
	  "currency": {
		"symbol": "VID",
		"address": "0x2c9023bbc572ff8dc1228c7858a280046ea8c9e5",
		"name": "VideoCoin"
	  },
	  "count": 275,
	  "senders": 2,
	  "receivers": 270,
	  "amount": 1446522.5873743107,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CRO",
		"address": "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b",
		"name": "CRO"
	  },
	  "count": 273,
	  "senders": 144,
	  "receivers": 165,
	  "amount": 9640196.12829261,
	  "amount_usd": 503540.03276961856
	},
	{
	  "currency": {
		"symbol": "MAYC",
		"address": "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
		"name": "MutantApeYachtClub"
	  },
	  "count": 273,
	  "senders": 87,
	  "receivers": 95,
	  "amount": 273,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "Pepetricia",
		"address": "0xb177822a6330da6b353b650e190d4278a73d2b68",
		"name": "Pepetricia Sniperbot"
	  },
	  "count": 272,
	  "senders": 43,
	  "receivers": 64,
	  "amount": 1136479749.426886,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPEC",
		"address": "0x428f9bacc1e15edd8b459b55e7e53a43cbffc62d",
		"name": "Pepe Classic"
	  },
	  "count": 272,
	  "senders": 43,
	  "receivers": 61,
	  "amount": 4696440068.477493,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PURPLE",
		"address": "0xdf90124b8a10d52a5df27d3f61f94f44ade09f12",
		"name": "Purple Lambo"
	  },
	  "count": 270,
	  "senders": 129,
	  "receivers": 87,
	  "amount": 106957680.18347964,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHIA",
		"address": "0xa90e0127462270a5e90eb8c38eba1245a1f3e7c3",
		"name": "HarryPotterObamaShibaSaga10Inu"
	  },
	  "count": 270,
	  "senders": 41,
	  "receivers": 61,
	  "amount": 444097376.55016685,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GLCH",
		"address": "0x038a68ff68c393373ec894015816e33ad41bd564",
		"name": "Glitch"
	  },
	  "count": 270,
	  "senders": 119,
	  "receivers": 67,
	  "amount": 25821613.560286637,
	  "amount_usd": 382289.12455736514
	},
	{
	  "currency": {
		"symbol": "ETH",
		"address": "0xad95d37bddc5b201d97605e0c55519307f7819f0",
		"name": "ETH"
	  },
	  "count": 270,
	  "senders": 181,
	  "receivers": 270,
	  "amount": 6960.3548068919235,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SUGAR",
		"address": "0xd2ce625515600b7799a5750a853ec8d2a44fbe27",
		"name": "Sugarbaby"
	  },
	  "count": 268,
	  "senders": 56,
	  "receivers": 48,
	  "amount": 499913.350031195,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPPY",
		"address": "0x1754beec5c1cc3b6c0dd535aeffb1fdef967bab1",
		"name": "Peppy"
	  },
	  "count": 268,
	  "senders": 45,
	  "receivers": 58,
	  "amount": 4846522.574816569,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SHITCOIN",
		"address": "0x71b5685af3cb429481cf8e9d6c0356dcdc0481ec",
		"name": "SatoshiLongbottomCramerBulbasaur420Inu"
	  },
	  "count": 268,
	  "senders": 53,
	  "receivers": 52,
	  "amount": 370298843.9730212,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "ƨƨᴙ",
		"address": "0x0a66d9205ff7567af914cba3df7c5d64d47c89c6",
		"name": "ReversedShiaSaga"
	  },
	  "count": 267,
	  "senders": 43,
	  "receivers": 50,
	  "amount": 4388524343843.49,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x22987ad161b7c0fcf7cb73734a01322ed901c418",
		"name": "HarryPotterObamaPepe1Inu"
	  },
	  "count": 267,
	  "senders": 46,
	  "receivers": 51,
	  "amount": 1390041090.912621,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "POE",
		"address": "0xe1d694acc0ba97387ba1ba0ed26437dd49f0ea05",
		"name": "THE RAVEN"
	  },
	  "count": 266,
	  "senders": 54,
	  "receivers": 27,
	  "amount": 4120160.68390897,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$MTPEPE",
		"address": "0x4143beeb65ceabec128f96e69c4321e20be276be",
		"name": "Mount Pepemore"
	  },
	  "count": 266,
	  "senders": 44,
	  "receivers": 67,
	  "amount": 487131377.27680373,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "VFS",
		"address": "0x3ab81d643a3155bd49e8b467d510840df4f79960",
		"name": "VinFast Auto"
	  },
	  "count": 264,
	  "senders": 46,
	  "receivers": 64,
	  "amount": 44312750.28947541,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "GUYS",
		"address": "0x7860dfb10037f803d8a5ef848fd1762d6793cfd2",
		"name": "GuysMix"
	  },
	  "count": 264,
	  "senders": 51,
	  "receivers": 73,
	  "amount": 41593293.15267755,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SOLANA",
		"address": "0x3d806324b6df5af3c1a81acba14a8a62fe6d643f",
		"name": "BarbieCrashBandicootRFK888Inu"
	  },
	  "count": 262,
	  "senders": 81,
	  "receivers": 75,
	  "amount": 461159854932828.9,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SG",
		"address": "0x8dbdbcb7d0f7ccc07aeb26bf320f7c39ee8e7295",
		"name": "SharesGram"
	  },
	  "count": 262,
	  "senders": 4,
	  "receivers": 7,
	  "amount": 30833461.407531597,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "SUSHI",
		"address": "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
		"name": "SushiToken"
	  },
	  "count": 262,
	  "senders": 138,
	  "receivers": 158,
	  "amount": 1904088.2047250257,
	  "amount_usd": 1138349.387721737
	},
	{
	  "currency": {
		"symbol": "degents",
		"address": "0x0f6979e74e4af9abed72298d818a2434fe0b95b6",
		"name": "degents"
	  },
	  "count": 259,
	  "senders": 2,
	  "receivers": 1,
	  "amount": 259,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "LAMBO",
		"address": "0x11aa8a4cc651b5cc7d970ed4072a8caff38f4147",
		"name": "PurpleLamboPepe"
	  },
	  "count": 257,
	  "senders": 54,
	  "receivers": 47,
	  "amount": 937512289.9359599,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BBANK",
		"address": "0xf4b5470523ccd314c6b9da041076e7d79e0df267",
		"name": "BlockBank"
	  },
	  "count": 256,
	  "senders": 76,
	  "receivers": 96,
	  "amount": 27409501.13055975,
	  "amount_usd": 400676.9858832699
	},
	{
	  "currency": {
		"symbol": "SS",
		"address": "0xaf83a5b079fe5316df4164cf7cccc15353910a38",
		"name": "Shiba Staking"
	  },
	  "count": 256,
	  "senders": 32,
	  "receivers": 76,
	  "amount": 2235959522.961159,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "RIO",
		"address": "0xf21661d0d1d76d3ecb8e1b9f1c923dbfffae4097",
		"name": "Realio Network"
	  },
	  "count": 255,
	  "senders": 77,
	  "receivers": 121,
	  "amount": 1344357.6902465902,
	  "amount_usd": 282450.7049510492
	},
	{
	  "currency": {
		"symbol": "HERO",
		"address": "0x1cadb5ebbd6a11b304b7e221cda7689ec11f18ed",
		"name": "Hero Pill"
	  },
	  "count": 254,
	  "senders": 81,
	  "receivers": 138,
	  "amount": 2419529114182.801,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "WPLS",
		"address": "0xa882606494d86804b5514e07e6bd2d6a6ee6d68a",
		"name": "Wrapped Pulse from PulseChain"
	  },
	  "count": 254,
	  "senders": 70,
	  "receivers": 86,
	  "amount": 13564273704.972298,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "CBot",
		"address": "0xf49311af05a4ffb1dbf33d61e9b2d4f0a7d4a71c",
		"name": "CompanionBot"
	  },
	  "count": 254,
	  "senders": 84,
	  "receivers": 127,
	  "amount": 1617506.062034646,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FRAX",
		"address": "0x853d955acef822db058eb8505911ed77f175b99e",
		"name": "Frax"
	  },
	  "count": 252,
	  "senders": 92,
	  "receivers": 101,
	  "amount": 16138860.197027016,
	  "amount_usd": 16107634.273233473
	},
	{
	  "currency": {
		"symbol": "PF",
		"address": "0x90bec61470b2daf082237a909c6c0508cd5ae78e",
		"name": "Pepefriend"
	  },
	  "count": 252,
	  "senders": 45,
	  "receivers": 77,
	  "amount": 42591021954954320,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEEPO",
		"address": "0x7cc1aba3948ab74ff7cb6551bee8b88de45e2b7c",
		"name": "PEEPO"
	  },
	  "count": 252,
	  "senders": 46,
	  "receivers": 62,
	  "amount": 465546944.7953459,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0xdeb9239512171fcde962089ac3a3f9dcd8da2318",
		"name": "Uniswap V2"
	  },
	  "count": 251,
	  "senders": 18,
	  "receivers": 23,
	  "amount": 35904.53036881794,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "HOTDOG",
		"address": "0x01e87d74b11f656a673a3e7c441425816213eb0c",
		"name": "Sonic"
	  },
	  "count": 251,
	  "senders": 37,
	  "receivers": 51,
	  "amount": 5683141.249167402,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PEPE",
		"address": "0x959a41a277d6d65b9007fa7fca0f5da9d2457ee3",
		"name": "Reeeeee"
	  },
	  "count": 250,
	  "senders": 38,
	  "receivers": 55,
	  "amount": 4073123.257175528,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "$PEPEG",
		"address": "0xce8de9f51b7d3dee856f42c13dcb18af25615a83",
		"name": "Pepe Girl"
	  },
	  "count": 249,
	  "senders": 117,
	  "receivers": 93,
	  "amount": 268752580548.6468,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "FTM",
		"address": "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
		"name": "Fantom Token"
	  },
	  "count": 249,
	  "senders": 104,
	  "receivers": 117,
	  "amount": 7723459.722320059,
	  "amount_usd": 1559471.9098097016
	},
	{
	  "currency": {
		"symbol": "COMP",
		"address": "0xc00e94cb662c3520282e6f5717214004a7f26888",
		"name": "Compound"
	  },
	  "count": 249,
	  "senders": 132,
	  "receivers": 172,
	  "amount": 399710.9932686818,
	  "amount_usd": 16586660.434388997
	},
	{
	  "currency": {
		"symbol": "BLAST",
		"address": "0x232eeeca6a0ecbebee7092722bbee1152bdaff74",
		"name": "Blast Game"
	  },
	  "count": 249,
	  "senders": 36,
	  "receivers": 74,
	  "amount": 4262567323.1602974,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BLAZE",
		"address": "0x3272301dbf99ed4d9377947f670c9cd75c8ee028",
		"name": "BlazeAI"
	  },
	  "count": 248,
	  "senders": 64,
	  "receivers": 37,
	  "amount": 558480583195.6638,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PLU",
		"address": "0xd8912c10681d8b21fd3742244f44658dba12264e",
		"name": "Pluton"
	  },
	  "count": 247,
	  "senders": 73,
	  "receivers": 196,
	  "amount": 16889.76730327249,
	  "amount_usd": 116866.88575799554
	},
	{
	  "currency": {
		"symbol": "PEPE3.14",
		"address": "0x0a5015ecfce86efd6f22580a2ad79e94b1991f68",
		"name": "Pepe π"
	  },
	  "count": 244,
	  "senders": 41,
	  "receivers": 48,
	  "amount": 4612389801.093462,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "DATA",
		"address": "0xb551b43af192965f74e3dfaa476c890b403cad95",
		"name": "Data bot"
	  },
	  "count": 243,
	  "senders": 45,
	  "receivers": 56,
	  "amount": 305739347.95050144,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "UNI-V2",
		"address": "0x181eb1db23ea646f286a1638fb44a634e0b62acb",
		"name": "Uniswap V2"
	  },
	  "count": 243,
	  "senders": 12,
	  "receivers": 21,
	  "amount": 78523.1379504958,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "BLEST",
		"address": "0x6c0bfb2aa91ca4b493271364d3cd9552f56a28c7",
		"name": "BlockHarvest"
	  },
	  "count": 240,
	  "senders": 39,
	  "receivers": 71,
	  "amount": 149585017671761.1,
	  "amount_usd": 0
	},
	{
	  "currency": {
		"symbol": "PepeGod",
		"address": "0x3021b5ee97d6122c8f4b4ecad752c017ef6fb6e6",
		"name": "PepeGod"
	  },
	  "count": 240,
	  "senders": 19,
	  "receivers": 78,
	  "amount": 161705.69390994,
	  "amount_usd": 0
	}
  ]

exports.tokens = tokens