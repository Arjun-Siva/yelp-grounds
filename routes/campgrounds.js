var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/",function(req,res){
	
	Campground.find(function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
	
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
	res.render("campgrounds/edit",{campground: foundCampground});
});

});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err){res.redirect("/campgrounds");}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var author= {
		id:req.user._id,
		username: req.user.username
	};
	var cmpgrnd=new Campground(
    {
        name: name,
        image: image,
		description: desc,
		author: author
    });
cmpgrnd.save(function (err, cmpgrnd) {
    if (err) return console.error(err);
	res.redirect("/campgrounds");
  });
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// New 
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
	
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds")
		}
	});
});

module.exports = router;