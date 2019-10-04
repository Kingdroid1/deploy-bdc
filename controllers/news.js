const NewsApi = require("newsapi");
const newsApi = new NewsApi("1780b0ee8c944a54a28ca91047a1271a");
const News = require("../models/news");

module.exports.createNews = async (req, res) => {

	try {
		newsData = [];
		newsApi.v2
			.topHeadlines({
				q: "markets",
				category: "business",
				domains: "https://www.bloomberg.com",
				language: "en"
			})
			.then(response => {
				this.newsData = response.articles;
				this.newsData.push(response.articles);
				console.log("am newsdata", this.newsData);
				if (this.newsData.length) {
					this.newsData.forEach(element => {
						var news = new News();

						news.source = element.source;
						news.title = element.title;
						news.content = element.content;
						news.description = element.description;
						news.source_url = element.url;
						news.featured_image_url = element.urlToImage;

						news.save(function (err, resp) {
							if (err) {
								console.error(err);
							} else {}
						});
					});
				}

			}).catch(err => {
				throw err
			});
		res.status(200).json({
			status: true,
			message: this.newsData
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports.listNews = (req, res) => {
	News.find({})
		.limit(5)
		.sort({
			createdAt: -1
		})
		.then(news =>
			res.status(200).json({
				status: true,
				message: news
			})
		)
		.catch(err => res.send(err));

};

// module.exports.getNews = (req, res) => {
// 	const { id } = req.params;

// 	News.findById(id)
// 		.then(news => res.status(200)
// 			.json({
// 				status: true,
// 				message: (news)
// 			}))
// 		.then(err => res.send(err));
// }

// module.exports.updateNews = (req, res) => {
// 	News.findByIdAndUpdate(req.params.id, req.body, { new: true })
// 		.then(user => res.status(200)
// 			.json({
// 				status: true,
// 				message: (user)
// 			}))
// 		.then(err => res.send(err));
// }

// module.exports.deleteNews = (req, res) => {
// 	const { id } = req.params;
// 	News.findByIdAndRemove({ id })
// 		.then(news => res.status(200)
// 			.json({
// 				status: true,
// 				message: 'news deleted',
// 				news
// 			}))
// 		.then(err => res.send(err));
// }