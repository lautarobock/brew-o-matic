db.recipes.find().snapshot().forEach(function(recipe) {
    
    if ( recipe.isPublic ) {
        recipe.publishDate = recipe.date;
    }
    db.recipes.save(recipe);
});