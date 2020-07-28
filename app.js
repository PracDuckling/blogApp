
var express = require("express"),
	 app = express(),
	 mongoose = require("mongoose"),
 	 bodyParser = require("body-parser"),
 	 methodOverride = require("method-override"),
 	 expressSanitizer = require("express-sanitizer");

//initilise app
 	 app.set("view engine", "ejs");
 	 app.use(bodyParser.urlencoded({extended:true}));
 	 app.use(expressSanitizer());
 	 app.use(express.static("public"));
 	 app.use(methodOverride("_method"));


//////////////////////////////////////////



//Database stuff

mongoose.connect("mongodb://localhost/blog_site", {
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useFindAndModify: false
});
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



//////////////////////////////////////////

//ROUTES
app.get("/",function(req,res){
	res.redirect("/index");
});
//Index
app.get("/index", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			res.send(err);
		}else{
			res.render("index",{blogs: blogs});
		}
	});

	
});
//New
app.get("/index/new", function(req,res){
	res.render("new");
});
//Create
app.post("/index", function(req, res){
	req.body.newBlog.body = req.sanitize(req.body.newBlog.body);
	Blog.create(req.body.newBlog, function(err, blog){
		if(err){
			res.send(err);
		}else {
			res.redirect("/index");
		}
	});
	
});

//show 
app.get("/index/:id", function(req,res){
	Blog.findById(req.params.id, function(err, blogDetails){
		if(err){
			res.send(err);
		}else{
			res.render("show",{blog: blogDetails});
		}					  //inside show: var name here
	});
});

//edit
app.get("/index/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err, blogDetails){
		if(err){
			res.send(err);
		}else{
			res.render("edit",{blog: blogDetails});
		}		
	});

});
//update
app.put("/index/:id",function(req,res){
	req.body.newBlog.body = req.sanitize(req.body.newBlog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.newBlog,function(err,updatedBlog){
		if(err){
			res.send(err);
		}else{
			res.redirect("/index/" + req.params.id);
		}
	});
});
//delete
app.delete("/index/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.send(err);
		}else{
			res.redirect("/index");
		}
	});
});

app.listen(3000, function(){
	console.log("server started");
});	