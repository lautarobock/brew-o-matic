db.users.update({},{ $set: { settings: {
			"defaultValues" : {
			"BATCH_SIZE" : 20,
			"EFFICIENCY" : 70,
			"BREWER" : '',
			"BOIL_TIME" : 90,
			"GrainTemp" : 25,
			"WatertoGrainRatio" : 3,
			"mashTemp" : 66,
			"lossMashTemp" : 0,
			"SpargeTempDesired" : 75,
			"SpargeDeadSpace" : 0,
			"GrainAbsorbtion" : 0.9,
			"PercentEvap" : 10,
			"TrubChillerLosses" : 0
		}
	}  } },{multi:true})
