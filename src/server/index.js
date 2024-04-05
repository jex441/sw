import express from "express";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import "dotenv/config";
import SequelizeStore from "connect-session-sequelize";

import db from "../db/index.js";
import { User } from "../db/models/index.js";

import users from "./lib/users.js";

import { createServer } from "node:http";
import { Server } from "socket.io";

// Constants
const port = process.env.PORT || 3003;
const __dirname = path.resolve();

const { env_vars } = process.env;

const sequelizeStore = SequelizeStore(session.Store);
const store = new sequelizeStore({ db });

const app = express();

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	socket.on("action", () => {
		socket.emit("reaction");
	});
});

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store,
	})
);

// body parsing middleware
app.use(express.json());
app.use("/", express.static(__dirname + "/dist"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username, avatar: user.avatar });
	});
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: GOOGLE_OAUTH_APP_CLIENT_ID,
// 			clientSecret: GOOGLE_OAUTH_APP_CLIENT_SECRET,
// 			callbackURL: GOOGLE_OAUTH_APP_CALLBACK_URL,
// 			scope: ["https://www.googleapis.com/auth/userinfo.email"],
// 		},
// 		async function (accessToken, refreshToken, profile, cb) {
// 			const email = profile.emails[0].value;
// 			const username = email.split("@")[0];
// 			const [user, created] = await User.findOrCreate({
// 				where: { email: email },
// 				defaults: {
// 					username: username,
// 					email: profile.emails[0].value,
// 					googleID: profile.id,
// 					avatar: profile.photos[0].value,
// 					verifiedThru: "google",
// 				},
// 			});
// 			if (created) {
// 				console.log("user id", user.id);
// 				await addToSandbox(user.id);
// 			}
// 			return cb(null, user);
// 		}
// 	)
// );

app.use(express.static("public"));

app.get("/:username", (req, res) => {
	let data = {};
	if (req.params.username === "jeffblanco") {
		data = {
			username: "jeff blanco",
			type: "painter",
			works: [
				{
					id: 1,
					index: 1,
					galleryId: 1,
					title: "A group of buildings",
					year: 2018,
					medium: "photograph",
					sold: false,
					description: "Morocco 2018",
					dimensions: { h: 22, w: 33, d: 0, unit: "inches" },
					mainImgUrl:
						"https://plus.unsplash.com/premium_photo-1695735927052-a03480eaddd1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1553125383-b83ec7e029cd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
							url: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 2,
					index: 2,
					galleryId: 2,
					title: "Sunset over the mountains",
					year: 2020,
					medium: "oil on canvas",
					sold: false,
					description: "Painting of a beautiful sunset scene",
					dimensions: { h: 30, w: 40, d: 2, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1680034200919-26a16a426d34?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1531493926222-5c1c0253c0d8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 3,
					index: 3,
					galleryId: 1,
					title: "Abstract sculpture",
					year: 2019,
					medium: "mixed media",
					sold: true,
					description: "An abstract sculpture made from various materials",
					dimensions: { h: 15, w: 10, d: 8, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1680034200933-09075ddb0843?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1680034200933-09075ddb0843?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 4,
					index: 4,
					galleryId: 3,
					title: "Still life with fruits",
					year: 2017,
					medium: "acrylic on canvas",
					sold: false,
					description: "Vibrant painting depicting a bowl of fruits",
					dimensions: { h: 24, w: 36, d: 1.5, unit: "inches" },
					mainImgUrl:
						"https://plus.unsplash.com/premium_photo-1695735926491-3cd5af73688e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926491-3cd5af73688e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926491-3cd5af73688e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 5,
					index: 5,
					galleryId: 2,
					title: "Cityscape at night",
					year: 2021,
					medium: "photograph",
					sold: true,
					description: "Photograph capturing the beauty of a city at night",
					dimensions: { h: 18, w: 24, d: 0, unit: "inches" },
					mainImgUrl:
						"https://plus.unsplash.com/premium_photo-1695735926305-081fda585c82?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926305-081fda585c82?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926305-081fda585c82?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 6,
					index: 6,
					galleryId: 3,
					title: "Portrait of a woman",
					year: 2016,
					medium: "charcoal on paper",
					sold: false,
					description: "Detailed portrait of a young woman",
					dimensions: { h: 16, w: 12, d: 0, unit: "inches" },
					mainImgUrl:
						"https://plus.unsplash.com/premium_photo-1695735926059-6b866b72fedd?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926059-6b866b72fedd?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://plus.unsplash.com/premium_photo-1695735926059-6b866b72fedd?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 7,
					index: 7,
					galleryId: 1,
					title: "Abstract painting",
					year: 2022,
					medium: "watercolor on paper",
					sold: false,
					description: "Colorful abstract painting with geometric shapes",
					dimensions: { h: 20, w: 16, d: 0, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1680034200960-4ed128f6a9ab?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1680034200960-4ed128f6a9ab?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1680034200960-4ed128f6a9ab?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 8,
					index: 8,
					galleryId: 2,
					title: "Landscape with a river",
					year: 2015,
					medium: "oil on canvas",
					sold: true,
					description: "Scenic landscape painting featuring a winding river",
					dimensions: { h: 24, w: 36, d: 1.5, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 9,
					index: 9,
					galleryId: 3,
					title: "Sculpture of a bird",
					year: 2023,
					medium: "bronze",
					sold: false,
					description: "Bronze sculpture depicting a bird in flight",
					dimensions: { h: 10, w: 8, d: 6, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1551801319-ca06060f3fcc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1551801319-ca06060f3fcc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1551801319-ca06060f3fcc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
				{
					id: 10,
					index: 10,
					galleryId: 1,
					title: "Abstract expressionist painting",
					year: 2019,
					medium: "acrylic on canvas",
					sold: true,
					description: "Vibrant abstract painting with bold brushstrokes",
					dimensions: { h: 36, w: 48, d: 1.5, unit: "inches" },
					mainImgUrl:
						"https://images.unsplash.com/photo-1653580559380-e44e45d2893e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
					thumbnails: [
						{
							url: "https://images.unsplash.com/photo-1653580559380-e44e45d2893e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
						{
							url: "https://images.unsplash.com/photo-1653580559380-e44e45d2893e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
						},
					],
				},
			],
		};
	} else if (req.params.username === "heffeblancito") {
	}

	// Render the HTML template with dynamically generated content
	const workComponent = function (work) {
		return `
		<div class="displayCase">
		<!-- Main image component -->
		<div class="displayContent">
			<div class="image">
				<img class="artwork" src="${work.mainImgUrl}" />
			</div>
			<!-- Caption, Description, Dimensions -->
			<div class="caption">
				<span>${work.title}</span>
				<span>${work.year}</span>
				<span>${work.dimensions.h} x ${work.dimensions.w} ${work.dimensions.unit}</span>
				<div class="thumbnails">
					${work.thumbnails.map((thumb) => {
						return `<span><img class="thumbnail" src="${thumb.url}" /></span>`;
					})}
				</div>
			</div>
		</div>
	
		<div class="lightbox hidden">
			<div class="lightboxHeader">
				<img id="closebtn" src="close.png" />
			</div>
			<div class="lightboxContent">
				<div>
					<img class="mainImg" src="${work.mainImgUrl}" />
				</div>
				<div class="lightboxCaption">
					<span>${work.title}</span>
					<span>${work.year}</span>
					<span>${work.dimensions.h} x ${work.dimensions.w} x ${work.dimensions.d} ${
			work.dimensions.unit
		}
					</span>
					<span>${work.description}</span>
					<div class="thumbnails">
						${work.thumbnails.map((thumb) => {
							return `<span><img class="thumbnail" src="${thumb.url}" /></span>`;
						})}
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
	};

	const works = data.works.map((work) => workComponent(work));

	const script = `
	<script>

	// Need to insert/remove modal html with correct variables
		let closebtn;
	
		const main = document.getElementsByClassName("content");
	
	document.addEventListener("DOMContentLoaded", function(){
		[...document.querySelectorAll('.displayCase')].forEach(function(item) {
			closebtn = item.querySelector("#closebtn");
			const mainImg = item.querySelector(".artwork");
			const lightboxMainImg = item.querySelector(".mainImg");
			console.log('=>',lightboxMainImg)
			const mainImgSrc = mainImg.src;
			const lightbox =item.querySelector(".lightbox");

			mainImg.onclick = function () {
				lightbox.classList.toggle("hidden");
			};

			closebtn.onclick = function() {
				lightbox.classList.toggle("hidden")
			};

			item.querySelectorAll(".thumbnail").forEach(function(thumb) {
				thumb.onmouseover = function () {
					mainImg.src = thumb.src;
				}
				thumb.onmouseout = function () {
					mainImg.src = mainImgSrc;
				}
			})

			lightbox.querySelectorAll(".thumbnail").forEach(function(thumb){
				thumb.onmouseover = function () {
					lightboxMainImg.src = thumb.src;
				}
				thumb.onmouseout = function () {
					lightboxMainImg.src = mainImgSrc;
				}
			})

	   });
	
	})
		</script>`;

	// Combine the HTML template with the dynamically generated content
	const finalHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Website</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
		<nav>
		<header>${data.username}</header>
		<div>
			<span><a href="/work">Work</a></span>
			<span><a href="/about"></a>About</a></span>
			<span><a href="/contact"></a>Contact</a></span>
		</div>
	</nav>
            <main class="content">
			${works}
			</main>
            ${script}
        </body>
        </html>`;

	// Send the final HTML content as the response
	res.send(finalHtml);
});

app.get("/api/test", function (req, res) {
	return res.send(200);
});

app.get("/api/auth/google", passport.authenticate("google"));

app.get(
	"/api/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login",
		failureMessage: true,
	}),
	function (req, res) {
		res.redirect("/");
	}
);

app.get("/api/auth/logout", function (req, res) {
	req.logout(function (err) {
		req.session.destroy();
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.get("/api/auth/me", function (req, res) {
	if (!req.user) {
		return res.send({ isLoggedIn: false });
	}
	return res.send({ isLoggedIn: true, info: req.user });
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.use("/api/users", ensureAuthenticated, users);

app.use("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/dist/index.html"));
});

// Connect to database
const syncDB = async () => {
	await db.sync();
	console.log("All models were synchronized successfully.");
};

const authenticateDB = async () => {
	try {
		await db.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

syncDB();
authenticateDB();

// Start http server
server.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
