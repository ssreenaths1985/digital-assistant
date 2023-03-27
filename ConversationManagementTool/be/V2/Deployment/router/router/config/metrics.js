

var conversions   = {
        "currency" : {"units":["CAD","HKD","EUR","ISK","PHP","DKK","HUF","CZK","AUD","RON","SEK","IDR","INR","BRL","RUB","HRK","JPY","THB","CHF","SGD","PLN","BGN","TRY","CNY","NOK","NZD","ZAR","USD","MXN","ILS","GBP","KRW","MYR"]
	},
        "mass"  : {"units":["pound","ounce","kilogram","gram"],
		"values" : {
			"kilogram":1,
			"gram" : 1000,
			"ounce": 35.274,
			"pound": 2.20462
		}
	},
	"volume"  : {"units":["liter","gallon","milliliter"],
                "values" : {
			"liter"  : 1,
			"gallon" : 0.219969,
			"milliliter": 1000
		}
        },
	"temprature"  : {"units":["kelvin","celsius","fahrenheit"]
        },
	"distance"  : {"units":["kilometer","mile","foot","inch","centimeter","meter"],
                "values" : {
			"kilometer" : 1,
			"mile" : 0.621371,
			"foot" : 3280.84,
			"inch" : 39370.1,
			"centimeter": 100000,
			"meter" : 1000
		}
        }

}

module.exports.conversions   = conversions;

