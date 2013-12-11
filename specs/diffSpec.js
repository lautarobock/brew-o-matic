describe("Diff", function() {

	var obj1 = {
		name: "Jose"
	};

	var obj2 = {
		name: "Raul"
	};

	var obj3 = {
		name: "Raul"
	};

	var obj4 = {
	
	};
	
	var big1 = {
		value1: 'value1',
		value2: 'value2',
		value3: 3,
		value4: 4.6,
	};

	var big2 = {
		value1: 'value1',
		value2: 'value2',
		value3: 3,
		value4: 4.6,
	};

	var big3 = {
		value1: 'value1',
		value3: 2,
		value4: 4.6,
	};

	var date1 = {
		today: new Date(0)
	};

	var date2 = {
		today: new Date(0)
	};

	var complex1 = {
		address: {
			street: 'Freneria',
			number: 12
		}
	};

	var complex2 = {
		address: {
			street: 'Freneria',
			number: 12
		}
	};

	var complex3 = {
		address: {
			street: 'Carrer Freneria',
			number: 12
		}
	};

	var complex4 = {
		address: {
			street: 'Carrer Freneria',
		}
	};

	var complex5 = {
		
	};

	var complex6 = {
		address: "Freneria 12"
	};

	var innerArray1 = {
		values: [1,2,3,4]
	};

	var innerArray2 = {
		values: [1,2,3,5]
	};

	var innerArray3 = {
		values: [1,2,3,4,5]
	};

	var innerArray4 = {
		values: [1,2,3]
	};

	var deepArray1 = {
		values: {
			value: [1,2,3]
		}
	};

	var deepArray2 = {
		values: {
			value: [1,2,4]
		}
	};

	var array1 = [0,1,2];

	var array2 = [0,4,2];

	var deepObject1 = {
		values: {
			deep: {
				name: "Raul"
			} 
		}
	};

	var deepObject2 = {
		values: {
			deep: {
				name: "Jose"
			} 
		}
	};

	it("Should detect diferences in fist level simple attributes", function() {
		
		var diff = util.diff(obj1,obj2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");

		diff = util.diff(obj2,obj3);
		expect(diff.length).toBe(0);
	});

	it("Should detect empty right values", function() {

		var diff = util.diff(obj1,obj4);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");
	});

	it("Should detect empty left values", function() {

		var diff = util.diff(obj4,obj1);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");
	});

	it("Should detect in more than one diferences",function() {

		var diff = util.diff(big1,big2);
		expect(diff.length).toBe(0);

		var diff = util.diff(big1,big3);
		expect(diff.length).toBe(2);
		expect(diff[0]).toBe("$.value2");
		expect(diff[1]).toBe("$.value3");
	});

	it("Should detect diferences in Date",function() {
		var diff = util.diff(date1,date2);
		expect(diff.length).toBe(0);
	});

	it("Should detect diferences in complex object", function() {
		var diff = util.diff(complex1,complex2);
		expect(diff.length).toBe(0);

		diff = util.diff(complex1,complex3);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.address.street");

		diff = util.diff(complex1,complex4);
		expect(diff.length).toBe(2);
		expect(diff.indexOf("$.address.street")).not.toBe(-1);
		expect(diff.indexOf("$.address.number")).not.toBe(-1);

		diff = util.diff(complex1,complex5);
		expect(diff.length).toBe(1);
		expect(diff.indexOf("$.address")).not.toBe(-1);

		diff = util.diff(complex5,complex1);
		expect(diff.length).toBe(1);
		expect(diff.indexOf("$.address")).not.toBe(-1);

		diff = util.diff(complex1,complex6);
		expect(diff.length).toBe(1);
		expect(diff.indexOf("$.address")).not.toBe(-1);

		diff = util.diff(complex6,complex1);
		expect(diff.length).toBe(1);
		expect(diff.indexOf("$.address")).not.toBe(-1);
	});

	it("Should detect diferences in arrays", function() {
		var diff = util.diff(innerArray1,innerArray1);
		expect(diff.length).toBe(0);

		diff = util.diff(innerArray1,innerArray2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values[3]");

		diff = util.diff(innerArray1,innerArray3);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values[4]");

		diff = util.diff(innerArray3,innerArray1);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values[4]");

		diff = util.diff(innerArray1,innerArray4);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values[3]");

		diff = util.diff(innerArray4,innerArray1);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values[3]");
	});

	it("Should detect diferences in deep arrays", function() {
		var diff = util.diff(deepArray1,deepArray2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values.value[2]");
	});

	it("Should detect diferences in deep object", function() {
		var diff = util.diff(deepObject1,deepObject2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.values.deep.name");
	});

	it("Should detect diferences in two string", function() {
		var diff = util.diff(array1,array2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$[1]");
	});

	it("Should detect diferences in recipes", function() {
		//Equals
		var diff = util.diff(recipe1,recipe1);
		expect(diff.length).toBe(0);

		//Name diference
		diff = util.diff(recipe1,recipe2);
		expect(diff.length).toBe(2);
		expect(diff.indexOf("$.NAME")).not.toBe(-1);
		expect(jsonPath(recipe1,"$.NAME")[0]).toBe(recipe1.NAME);
		expect(jsonPath(recipe2,"$.NAME")[0]).toBe(recipe2.NAME);
		expect(diff.indexOf("$.modificationDate")).not.toBe(-1);

		/*
		 * Add fermentable
		 */
		diff = util.diff(recipe2,recipe3);
		// console.log("diff",diff);
		expect(diff.length).toBe(15);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[5]")).not.toBe(-1);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[0].PERCENTAGE")).not.toBe(-1);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[1].PERCENTAGE")).not.toBe(-1);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[2].PERCENTAGE")).not.toBe(-1);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[3].PERCENTAGE")).not.toBe(-1);
		expect(diff.indexOf("$.FERMENTABLES.FERMENTABLE[4].PERCENTAGE")).not.toBe(-1);
		expect(diff.indexOf("$.modificationDate")).not.toBe(-1);
		expect(diff.indexOf("$.CALCIBU")).not.toBe(-1);
		//changes
		expect(jsonPath(recipe2,"$.FERMENTABLES.FERMENTABLE[2].PERCENTAGE")[0])
			.toBe(recipe2.FERMENTABLES.FERMENTABLE[2].PERCENTAGE);
		expect(jsonPath(recipe3,"$.FERMENTABLES.FERMENTABLE[2].PERCENTAGE")[0])
			.toBe(recipe3.FERMENTABLES.FERMENTABLE[2].PERCENTAGE);
	});

	var recipe3 = {
	  "ABV": 12.14,
	  "BATCH_SIZE": 10,
	  "BOIL_SIZE": 16.108370757564604,
	  "BOIL_TIME": 120,
	  "BREWER": "MacGyBeer",
	  "BV": 1.45,
	  "CALCCOLOUR": 46.40795467351162,
	  "CALCIBU": 67.1,
	  "EFFICIENCY": 47,
	  "FG": 1.02,
	  "GrainAbsorbtion": 0.9,
	  "GrainCalcMethod": "2",
	  "GrainTemp": 25,
	  "NAME": "Cocoa Psyco (BrewDog) 2",
	  "OG": 1.113,
	  "PercentEvap": 15,
	  "SpargeDeadSpace": 1,
	  "SpargeTempDesired": 75,
	  "StrikeWater": 18.1,
	  "TopUpWater": 0,
	  "TrubChillerLosses": 1,
	  "WatertoGrainRatio": 2.3,
	  "__v": 2,
	  "_id": "Cocoa_Psyco_Clone-5245bff54b11374753000005-1382345395257",
	  "code": "$002",
	  "date": "2013-10-21T08:46:16.861Z",
	  "fixIngredients": "1",
	  "isPublic": true,
	  "lossMashTemp": 2,
	  "mashTemp": 68,
	  "modificationDate": "2013-12-10T09:54:41.374Z",
	  "owner": {
	    "__v": 31,
	    "_id": "5245bff54b11374753000005",
	    "google_id": "108574023799049383077",
	    "isAdmin": true,
	    "lastLogin": "2013-12-10T09:49:29.597Z",
	    "name": "Lautaro Cozzani",
	    "singInDate": "2013-10-19T13:16:03.499Z",
	    "settings": {
	      "defaultValues": {
	        "BATCH_SIZE": 20,
	        "EFFICIENCY": 65,
	        "BREWER": "MacGyBeer",
	        "BOIL_TIME": 90,
	        "GrainTemp": 25,
	        "WatertoGrainRatio": 3,
	        "mashTemp": 66,
	        "lossMashTemp": 2,
	        "SpargeTempDesired": 75,
	        "SpargeDeadSpace": 1,
	        "GrainAbsorbtion": 0.9,
	        "PercentEvap": 15,
	        "TrubChillerLosses": 1,
	        "isPublic": false
	      }
	    },
	    "favorites": [
	      "Dorada_Pampeana-524611904b1137475300004f-1382642200269",
	      "Birra_Pulenta-524614634b11374753000050-1380326690952",
	      "Madonna-5249a1bf4b11374753000155-1385394540101",
	      "Dubbel-524c61e2b1c85f5118000020-1386181742164",
	      "Villana_Smoked_Mild-52461c6c4b11374753000056-1386336015655"
	    ]
	  },
	  "publishDate": "2013-10-21T08:46:16.861Z",
	  "totalAmount": 7.85,
	  "totalHop": 0.13999999999999999,
	  "tags": [
	    "clon",
	    "draft"
	  ],
	  "comments": [
	    {
	      "_id": "5245bff54b11374753000005_1382345605233",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "Receta experimental, no probada aun. \nPretende ser un clon de esta birra http://www.ratebeer.com/beer/brewdog-cocoa-psycho/194513/",
	      "date": "2013-10-21T08:53:25.233Z"
	    },
	    {
	      "_id": "5245bff54b11374753000005_1383951398588",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "ufff.. volvi a tomar esta birra. ahora de botella, increible!! mas ganas de hacerla todavia!",
	      "date": "2013-11-08T22:56:38.588Z"
	    }
	  ],
	  "clonedBy": [],
	  "starredBy": [
	    {
	      "_id": "5246f1e34b113747530000a7",
	      "name": "Santi Arrieta"
	    }
	  ],
	  "log": {
	    "logs": [
	      {
	        "time": "2013-12-04T10:58:51.313Z",
	        "delay": 0,
	        "detail": "Encender Fuego",
	        "logType": "START",
	        "discard": false,
	        "_id": "529f0ad2d6dbd06607000011"
	      },
	      {
	        "time": "2013-12-04T10:58:52.154Z",
	        "delay": 40,
	        "detail": "Mash-in - 68ºC  a 67ºC - 30 min",
	        "logType": "MASH_STEP",
	        "logRef": "5264ec082dc84bcb33000022",
	        "discard": true,
	        "_id": "529f0ad2d6dbd06607000010"
	      }
	    ]
	  },
	  "bottling": {
	    "bottles": [
	      {
	        "size": 0.33,
	        "amount": 15,
	        "subTotal": 4.95,
	        "carbonatationType": "sugar",
	        "bottleType": "Porron 330cc (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ece52dc84bcb33000030"
	      },
	      {
	        "size": 0.5,
	        "amount": 6,
	        "subTotal": 3.05,
	        "carbonatationType": "sugar",
	        "bottleType": "Botella 500c (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ecfc2dc84bcb33000032"
	      }
	    ],
	    "sugar": {
	      "desiredVol": 1.9,
	      "sugarType": "corn",
	      "temperature": 23
	    }
	  },
	  "fermentation": {
	    "view": "compact",
	    "estimateDate": "2013-10-20T22:00:00.000Z",
	    "stages": [
	      {
	        "title": "Inoculacion",
	        "duration": 6,
	        "durationMode": "Horas",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 23,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002e"
	      },
	      {
	        "title": "Primaria",
	        "duration": 6,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002d"
	      },
	      {
	        "title": "Atenuacion",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002c"
	      },
	      {
	        "title": "Descanso diacetilo",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 22,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002b"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 22,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002a"
	      },
	      {
	        "title": "Secundaria",
	        "duration": 15,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000029"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000028"
	      },
	      {
	        "title": "Clarificacion/Maduracion",
	        "duration": 30,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 0,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000027"
	      }
	    ]
	  },
	  "MASH": {
	    "MASH_STEPS": {
	      "MASH_STEP": [
	        {
	          "NAME": "Mash-in",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000022"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000021"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "_id": "5264ec082dc84bcb33000020"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 1.9,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 70,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 2.1,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb3300001f"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -1.3,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 20,
	          "STEP_TEMP": 70,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -1.7,
	          "recirculate": true,
	          "_id": "5264ec082dc84bcb3300001e"
	        }
	      ]
	    }
	  },
	  "MISCS": {
	    "MISC": [
	      {
	        "NAME": "Vanilla",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Boil",
	        "TIME": 10,
	        "AMOUNT": 0.002,
	        "_id": "5264eb6b2dc84bcb3300001b"
	      },
	      {
	        "NAME": "Cascarilla de cacao",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 60,
	        "AMOUNT": 0.01,
	        "_id": "5264eb6b2dc84bcb3300001a"
	      },
	      {
	        "NAME": "Granos de cafe molidos",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 30,
	        "AMOUNT": 0.005,
	        "_id": "5264eb6b2dc84bcb33000019"
	      }
	    ]
	  },
	  "YEASTS": {
	    "YEAST": [
	      {
	        "NAME": "Danstar Nottingham",
	        "VERSION": "1",
	        "ATTENUATION": 82,
	        "AMOUNT": 22,
	        "_id": "5264eab32dc84bcb3300000c"
	      }
	    ]
	  },
	  "HOPS": {
	    "HOP": [
	      {
	        "NAME": "Cascade Arg",
	        "VERSION": "1",
	        "ALPHA": 7.8,
	        "AMOUNT": 0.04,
	        "USE": "Boil",
	        "TIME": 60,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000017"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000016"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000015"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000014"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000013"
	      }
	    ]
	  },
	  "FERMENTABLES": {
	    "FERMENTABLE": [
	      {
	        "NAME": "Pale Ale (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 6,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 4,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 76.43,
	        "_id": "5264eab32dc84bcb33000011"
	      },
	      {
	        "NAME": "Trigo Malteado (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 0.35,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 3,
	        "POTENTIAL": 1.038,
	        "PERCENTAGE": 4.46,
	        "_id": "5264eab32dc84bcb33000010"
	      },
	      {
	        "NAME": "Rauchmalt",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 14,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 2.55,
	        "_id": "5264eab32dc84bcb3300000f"
	      },
	      {
	        "NAME": "Black Patent",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 525,
	        "POTENTIAL": 1.025,
	        "PERCENTAGE": 2.55,
	        "_id": "5264eab32dc84bcb3300000e"
	      },
	      {
	        "NAME": "Roasted Barley",
	        "VERSION": "1",
	        "AMOUNT": 0.1,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 450,
	        "POTENTIAL": 1.028,
	        "PERCENTAGE": 1.27,
	        "_id": "5264eab32dc84bcb3300000d"
	      },
	      {
	        "NAME": "Pilsnen Ba-Malt",
	        "VERSION": "1",
	        "AMOUNT": 1,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 2,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 12.74,
	        "_id": "52a6e4e1391b55987a00002e"
	      }
	    ]
	  },
	  "STYLE": {
	    "NAME": "Imperial Stout"
	  },
	  "collaborators": []
	};

	var recipe2 = {
	  "ABV": 10.53,
	  "BATCH_SIZE": 10,
	  "BOIL_SIZE": 16.108370757564604,
	  "BOIL_TIME": 120,
	  "BREWER": "MacGyBeer",
	  "BV": 1.91,
	  "CALCCOLOUR": 46.05335828254976,
	  "CALCIBU": 76.7,
	  "EFFICIENCY": 47,
	  "FG": 1.018,
	  "GrainAbsorbtion": 0.9,
	  "GrainCalcMethod": "2",
	  "GrainTemp": 25,
	  "NAME": "Cocoa Psyco (BrewDog) 2",
	  "OG": 1.098,
	  "PercentEvap": 15,
	  "SpargeDeadSpace": 1,
	  "SpargeTempDesired": 75,
	  "StrikeWater": 15.8,
	  "TopUpWater": 0,
	  "TrubChillerLosses": 1,
	  "WatertoGrainRatio": 2.3,
	  "__v": 2,
	  "_id": "Cocoa_Psyco_Clone-5245bff54b11374753000005-1382345395257",
	  "code": "$002",
	  "date": "2013-10-21T08:46:16.861Z",
	  "fixIngredients": "1",
	  "isPublic": true,
	  "lossMashTemp": 2,
	  "mashTemp": 68,
	  "modificationDate": "2013-12-10T09:51:11.321Z",
	  "owner": {
	    "__v": 31,
	    "_id": "5245bff54b11374753000005",
	    "google_id": "108574023799049383077",
	    "isAdmin": true,
	    "lastLogin": "2013-12-10T09:49:29.597Z",
	    "name": "Lautaro Cozzani",
	    "singInDate": "2013-10-19T13:16:03.499Z",
	    "settings": {
	      "defaultValues": {
	        "BATCH_SIZE": 20,
	        "EFFICIENCY": 65,
	        "BREWER": "MacGyBeer",
	        "BOIL_TIME": 90,
	        "GrainTemp": 25,
	        "WatertoGrainRatio": 3,
	        "mashTemp": 66,
	        "lossMashTemp": 2,
	        "SpargeTempDesired": 75,
	        "SpargeDeadSpace": 1,
	        "GrainAbsorbtion": 0.9,
	        "PercentEvap": 15,
	        "TrubChillerLosses": 1,
	        "isPublic": false
	      }
	    },
	    "favorites": [
	      "Dorada_Pampeana-524611904b1137475300004f-1382642200269",
	      "Birra_Pulenta-524614634b11374753000050-1380326690952",
	      "Madonna-5249a1bf4b11374753000155-1385394540101",
	      "Dubbel-524c61e2b1c85f5118000020-1386181742164",
	      "Villana_Smoked_Mild-52461c6c4b11374753000056-1386336015655"
	    ]
	  },
	  "publishDate": "2013-10-21T08:46:16.861Z",
	  "totalAmount": 6.85,
	  "totalHop": 0.13999999999999999,
	  "tags": [
	    "clon",
	    "draft"
	  ],
	  "comments": [
	    {
	      "_id": "5245bff54b11374753000005_1382345605233",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "Receta experimental, no probada aun. \nPretende ser un clon de esta birra http://www.ratebeer.com/beer/brewdog-cocoa-psycho/194513/",
	      "date": "2013-10-21T08:53:25.233Z"
	    },
	    {
	      "_id": "5245bff54b11374753000005_1383951398588",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "ufff.. volvi a tomar esta birra. ahora de botella, increible!! mas ganas de hacerla todavia!",
	      "date": "2013-11-08T22:56:38.588Z"
	    }
	  ],
	  "clonedBy": [],
	  "starredBy": [
	    {
	      "_id": "5246f1e34b113747530000a7",
	      "name": "Santi Arrieta"
	    }
	  ],
	  "log": {
	    "logs": [
	      {
	        "time": "2013-12-04T10:58:51.313Z",
	        "delay": 0,
	        "detail": "Encender Fuego",
	        "logType": "START",
	        "discard": false,
	        "_id": "529f0ad2d6dbd06607000011"
	      },
	      {
	        "time": "2013-12-04T10:58:52.154Z",
	        "delay": 40,
	        "detail": "Mash-in - 68ºC  a 67ºC - 30 min",
	        "logType": "MASH_STEP",
	        "logRef": "5264ec082dc84bcb33000022",
	        "discard": true,
	        "_id": "529f0ad2d6dbd06607000010"
	      }
	    ]
	  },
	  "bottling": {
	    "bottles": [
	      {
	        "size": 0.33,
	        "amount": 15,
	        "subTotal": 4.95,
	        "carbonatationType": "sugar",
	        "bottleType": "Porron 330cc (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ece52dc84bcb33000030"
	      },
	      {
	        "size": 0.5,
	        "amount": 6,
	        "subTotal": 3.05,
	        "carbonatationType": "sugar",
	        "bottleType": "Botella 500c (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ecfc2dc84bcb33000032"
	      }
	    ],
	    "sugar": {
	      "desiredVol": 1.9,
	      "sugarType": "corn",
	      "temperature": 23
	    }
	  },
	  "fermentation": {
	    "view": "compact",
	    "estimateDate": "2013-10-20T22:00:00.000Z",
	    "stages": [
	      {
	        "title": "Inoculacion",
	        "duration": 6,
	        "durationMode": "Horas",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 23,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002e"
	      },
	      {
	        "title": "Primaria",
	        "duration": 6,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002d"
	      },
	      {
	        "title": "Atenuacion",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002c"
	      },
	      {
	        "title": "Descanso diacetilo",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 22,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002b"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 22,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002a"
	      },
	      {
	        "title": "Secundaria",
	        "duration": 15,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000029"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000028"
	      },
	      {
	        "title": "Clarificacion/Maduracion",
	        "duration": 30,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 0,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000027"
	      }
	    ]
	  },
	  "MASH": {
	    "MASH_STEPS": {
	      "MASH_STEP": [
	        {
	          "NAME": "Mash-in",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000022"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000021"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "_id": "5264ec082dc84bcb33000020"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 1.9,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 70,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 2.1,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb3300001f"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -1.3,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 20,
	          "STEP_TEMP": 70,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -1.7,
	          "recirculate": true,
	          "_id": "5264ec082dc84bcb3300001e"
	        }
	      ]
	    }
	  },
	  "MISCS": {
	    "MISC": [
	      {
	        "NAME": "Vanilla",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Boil",
	        "TIME": 10,
	        "AMOUNT": 0.002,
	        "_id": "5264eb6b2dc84bcb3300001b"
	      },
	      {
	        "NAME": "Cascarilla de cacao",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 60,
	        "AMOUNT": 0.01,
	        "_id": "5264eb6b2dc84bcb3300001a"
	      },
	      {
	        "NAME": "Granos de cafe molidos",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 30,
	        "AMOUNT": 0.005,
	        "_id": "5264eb6b2dc84bcb33000019"
	      }
	    ]
	  },
	  "YEASTS": {
	    "YEAST": [
	      {
	        "NAME": "Danstar Nottingham",
	        "VERSION": "1",
	        "ATTENUATION": 82,
	        "AMOUNT": 22,
	        "_id": "5264eab32dc84bcb3300000c"
	      }
	    ]
	  },
	  "HOPS": {
	    "HOP": [
	      {
	        "NAME": "Cascade Arg",
	        "VERSION": "1",
	        "ALPHA": 7.8,
	        "AMOUNT": 0.04,
	        "USE": "Boil",
	        "TIME": 60,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000017"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000016"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000015"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000014"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000013"
	      }
	    ]
	  },
	  "FERMENTABLES": {
	    "FERMENTABLE": [
	      {
	        "NAME": "Pale Ale (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 6,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 4,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 87.59,
	        "_id": "5264eab32dc84bcb33000011"
	      },
	      {
	        "NAME": "Trigo Malteado (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 0.35,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 3,
	        "POTENTIAL": 1.038,
	        "PERCENTAGE": 5.11,
	        "_id": "5264eab32dc84bcb33000010"
	      },
	      {
	        "NAME": "Rauchmalt",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 14,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 2.92,
	        "_id": "5264eab32dc84bcb3300000f"
	      },
	      {
	        "NAME": "Black Patent",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 525,
	        "POTENTIAL": 1.025,
	        "PERCENTAGE": 2.92,
	        "_id": "5264eab32dc84bcb3300000e"
	      },
	      {
	        "NAME": "Roasted Barley",
	        "VERSION": "1",
	        "AMOUNT": 0.1,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 450,
	        "POTENTIAL": 1.028,
	        "PERCENTAGE": 1.46,
	        "_id": "5264eab32dc84bcb3300000d"
	      }
	    ]
	  },
	  "STYLE": {
	    "NAME": "Imperial Stout"
	  },
	  "collaborators": []
	};

	var recipe1 = {
	  "ABV": 10.53,
	  "BATCH_SIZE": 10,
	  "BOIL_SIZE": 16.108370757564604,
	  "BOIL_TIME": 120,
	  "BREWER": "MacGyBeer",
	  "BV": 1.91,
	  "CALCCOLOUR": 46.05335828254976,
	  "CALCIBU": 76.7,
	  "EFFICIENCY": 47,
	  "FG": 1.018,
	  "GrainAbsorbtion": 0.9,
	  "GrainCalcMethod": "2",
	  "GrainTemp": 25,
	  "NAME": "Cocoa Psyco (BrewDog)",
	  "OG": 1.098,
	  "PercentEvap": 15,
	  "SpargeDeadSpace": 1,
	  "SpargeTempDesired": 75,
	  "StrikeWater": 15.8,
	  "TopUpWater": 0,
	  "TrubChillerLosses": 1,
	  "WatertoGrainRatio": 2.3,
	  "__v": 2,
	  "_id": "Cocoa_Psyco_Clone-5245bff54b11374753000005-1382345395257",
	  "code": "$002",
	  "date": "2013-10-21T08:46:16.861Z",
	  "fixIngredients": "1",
	  "isPublic": true,
	  "lossMashTemp": 2,
	  "mashTemp": 68,
	  "modificationDate": "2013-12-04T10:58:26.658Z",
	  "owner": {
	    "__v": 31,
	    "_id": "5245bff54b11374753000005",
	    "google_id": "108574023799049383077",
	    "isAdmin": true,
	    "lastLogin": "2013-12-10T09:49:29.597Z",
	    "name": "Lautaro Cozzani",
	    "singInDate": "2013-10-19T13:16:03.499Z",
	    "settings": {
	      "defaultValues": {
	        "BATCH_SIZE": 20,
	        "EFFICIENCY": 65,
	        "BREWER": "MacGyBeer",
	        "BOIL_TIME": 90,
	        "GrainTemp": 25,
	        "WatertoGrainRatio": 3,
	        "mashTemp": 66,
	        "lossMashTemp": 2,
	        "SpargeTempDesired": 75,
	        "SpargeDeadSpace": 1,
	        "GrainAbsorbtion": 0.9,
	        "PercentEvap": 15,
	        "TrubChillerLosses": 1,
	        "isPublic": false
	      }
	    },
	    "favorites": [
	      "Dorada_Pampeana-524611904b1137475300004f-1382642200269",
	      "Birra_Pulenta-524614634b11374753000050-1380326690952",
	      "Madonna-5249a1bf4b11374753000155-1385394540101",
	      "Dubbel-524c61e2b1c85f5118000020-1386181742164",
	      "Villana_Smoked_Mild-52461c6c4b11374753000056-1386336015655"
	    ]
	  },
	  "publishDate": "2013-10-21T08:46:16.861Z",
	  "totalAmount": 6.85,
	  "totalHop": 0.13999999999999999,
	  "tags": [
	    "clon",
	    "draft"
	  ],
	  "comments": [
	    {
	      "_id": "5245bff54b11374753000005_1382345605233",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "Receta experimental, no probada aun. \nPretende ser un clon de esta birra http://www.ratebeer.com/beer/brewdog-cocoa-psycho/194513/",
	      "date": "2013-10-21T08:53:25.233Z"
	    },
	    {
	      "_id": "5245bff54b11374753000005_1383951398588",
	      "user_id": "5245bff54b11374753000005",
	      "name": "Lautaro Cozzani",
	      "text": "ufff.. volvi a tomar esta birra. ahora de botella, increible!! mas ganas de hacerla todavia!",
	      "date": "2013-11-08T22:56:38.588Z"
	    }
	  ],
	  "clonedBy": [],
	  "starredBy": [
	    {
	      "_id": "5246f1e34b113747530000a7",
	      "name": "Santi Arrieta"
	    }
	  ],
	  "log": {
	    "logs": [
	      {
	        "time": "2013-12-04T10:58:51.313Z",
	        "delay": 0,
	        "detail": "Encender Fuego",
	        "logType": "START",
	        "discard": false,
	        "_id": "529f0ad2d6dbd06607000011"
	      },
	      {
	        "time": "2013-12-04T10:58:52.154Z",
	        "delay": 40,
	        "detail": "Mash-in - 68ºC  a 67ºC - 30 min",
	        "logType": "MASH_STEP",
	        "logRef": "5264ec082dc84bcb33000022",
	        "discard": true,
	        "_id": "529f0ad2d6dbd06607000010"
	      }
	    ]
	  },
	  "bottling": {
	    "bottles": [
	      {
	        "size": 0.33,
	        "amount": 15,
	        "subTotal": 4.95,
	        "carbonatationType": "sugar",
	        "bottleType": "Porron 330cc (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ece52dc84bcb33000030"
	      },
	      {
	        "size": 0.5,
	        "amount": 6,
	        "subTotal": 3.05,
	        "carbonatationType": "sugar",
	        "bottleType": "Botella 500c (Ambar)",
	        "colour": "Ambar",
	        "_id": "5264ecfc2dc84bcb33000032"
	      }
	    ],
	    "sugar": {
	      "desiredVol": 1.9,
	      "sugarType": "corn",
	      "temperature": 23
	    }
	  },
	  "fermentation": {
	    "view": "compact",
	    "estimateDate": "2013-10-20T22:00:00.000Z",
	    "stages": [
	      {
	        "title": "Inoculacion",
	        "duration": 6,
	        "durationMode": "Horas",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 23,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002e"
	      },
	      {
	        "title": "Primaria",
	        "duration": 6,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 18,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002d"
	      },
	      {
	        "title": "Atenuacion",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 18,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002c"
	      },
	      {
	        "title": "Descanso diacetilo",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 22,
	        "temperatureEnd": 22,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002b"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 22,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb3300002a"
	      },
	      {
	        "title": "Secundaria",
	        "duration": 15,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 10,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000029"
	      },
	      {
	        "title": "Enfriado",
	        "duration": 2,
	        "durationMode": "Dias",
	        "transferring": false,
	        "losses": 0,
	        "temperature": 10,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000028"
	      },
	      {
	        "title": "Clarificacion/Maduracion",
	        "duration": 30,
	        "durationMode": "Dias",
	        "transferring": true,
	        "losses": 1,
	        "temperature": 0,
	        "temperatureEnd": 0,
	        "action": null,
	        "_id": "5264ecd12dc84bcb33000027"
	      }
	    ]
	  },
	  "MASH": {
	    "MASH_STEPS": {
	      "MASH_STEP": [
	        {
	          "NAME": "Mash-in",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000022"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 0.7,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb33000021"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -0.6,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 30,
	          "STEP_TEMP": 68,
	          "END_TEMP": 67,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -0.7,
	          "recirculate": false,
	          "_id": "5264ec082dc84bcb33000020"
	        },
	        {
	          "NAME": "Levantar",
	          "TYPE": "Infusion",
	          "infuse": true,
	          "INFUSE_AMOUNT": 1.9,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 5,
	          "STEP_TEMP": 67,
	          "END_TEMP": 70,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": 2.1,
	          "recirculate": false,
	          "decoction": false,
	          "_id": "5264ec082dc84bcb3300001f"
	        },
	        {
	          "NAME": "Mantener",
	          "TYPE": "Infusion",
	          "infuse": false,
	          "INFUSE_AMOUNT": -1.3,
	          "INFUSE_TEMP": 100,
	          "STEP_TIME": 20,
	          "STEP_TEMP": 70,
	          "END_TEMP": 68,
	          "DESCRIPTION": null,
	          "WATER_GRAIN_RATIO": 2.3,
	          "DECOCTION_AMT": -1.7,
	          "recirculate": true,
	          "_id": "5264ec082dc84bcb3300001e"
	        }
	      ]
	    }
	  },
	  "MISCS": {
	    "MISC": [
	      {
	        "NAME": "Vanilla",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Boil",
	        "TIME": 10,
	        "AMOUNT": 0.002,
	        "_id": "5264eb6b2dc84bcb3300001b"
	      },
	      {
	        "NAME": "Cascarilla de cacao",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 60,
	        "AMOUNT": 0.01,
	        "_id": "5264eb6b2dc84bcb3300001a"
	      },
	      {
	        "NAME": "Granos de cafe molidos",
	        "VERSION": "1",
	        "TYPE": "Flavor",
	        "USE": "Mash",
	        "TIME": 30,
	        "AMOUNT": 0.005,
	        "_id": "5264eb6b2dc84bcb33000019"
	      }
	    ]
	  },
	  "YEASTS": {
	    "YEAST": [
	      {
	        "NAME": "Danstar Nottingham",
	        "VERSION": "1",
	        "ATTENUATION": 82,
	        "AMOUNT": 22,
	        "_id": "5264eab32dc84bcb3300000c"
	      }
	    ]
	  },
	  "HOPS": {
	    "HOP": [
	      {
	        "NAME": "Cascade Arg",
	        "VERSION": "1",
	        "ALPHA": 7.8,
	        "AMOUNT": 0.04,
	        "USE": "Boil",
	        "TIME": 60,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000017"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000016"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 30,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000015"
	      },
	      {
	        "NAME": "East Kent Golding",
	        "VERSION": "1",
	        "ALPHA": 4.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000014"
	      },
	      {
	        "NAME": "Fuggles",
	        "VERSION": "1",
	        "ALPHA": 5.7,
	        "AMOUNT": 0.025,
	        "USE": "Boil",
	        "TIME": 0,
	        "FORM": "Pellet",
	        "_id": "5264eb082dc84bcb33000013"
	      }
	    ]
	  },
	  "FERMENTABLES": {
	    "FERMENTABLE": [
	      {
	        "NAME": "Pale Ale (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 6,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 4,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 87.59,
	        "_id": "5264eab32dc84bcb33000011"
	      },
	      {
	        "NAME": "Trigo Malteado (Ba-Malt)",
	        "VERSION": "1",
	        "AMOUNT": 0.35,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 3,
	        "POTENTIAL": 1.038,
	        "PERCENTAGE": 5.11,
	        "_id": "5264eab32dc84bcb33000010"
	      },
	      {
	        "NAME": "Rauchmalt",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 14,
	        "POTENTIAL": 1.037,
	        "PERCENTAGE": 2.92,
	        "_id": "5264eab32dc84bcb3300000f"
	      },
	      {
	        "NAME": "Black Patent",
	        "VERSION": "1",
	        "AMOUNT": 0.2,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 525,
	        "POTENTIAL": 1.025,
	        "PERCENTAGE": 2.92,
	        "_id": "5264eab32dc84bcb3300000e"
	      },
	      {
	        "NAME": "Roasted Barley",
	        "VERSION": "1",
	        "AMOUNT": 0.1,
	        "TYPE": "Grain",
	        "YIELD": 0,
	        "COLOR": 450,
	        "POTENTIAL": 1.028,
	        "PERCENTAGE": 1.46,
	        "_id": "5264eab32dc84bcb3300000d"
	      }
	    ]
	  },
	  "STYLE": {
	    "NAME": "Imperial Stout"
	  },
	  "collaborators": []
	};
});