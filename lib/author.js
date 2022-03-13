var url = require('url');
var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
const { authorTable } = require('./template.js');

exports.home = function(request, response){
    db.query('SELECT * FROM topic', function(error, topics){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2){
                throw error2;
            }
            var title = 'Author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>
                ${authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:2px solid black;
                    }
                </style>
                `,
                `<a href="/author/create">author create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
},
exports.create = function(request, response){
    db.query('SELECT * FROM topic', function(error, topics){
        db.query(`SELECT * FROM author`,function(error2, authors){
          var title = 'Author Create';
          var html = template.HTML(title, ``,
            `<form action="/author/create_process" method="post">
            <p><input type="text" name="name" placeholder="name"></p>
            <p>
              <textarea name="profile" placeholder="profile"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`,
            `<p>Author Create</p>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
},
exports.create_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
          [post.name, post.profile],
          function(error, result){
            if(error){
            throw error;
            }
          response.writeHead(302, {Location: `/author`});
          response.end();
      })});
},
exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function(error, topics){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error2, author){
            if(error2){
                throw error2;
            }
            var title = 'Author Update';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>
                <form action="/author/update_process" method="post">
                <input type="hidden" name="id" value="${author[0].id}">
                <p>
                  <input type="text" name="name" placeholder="name" value="${author[0].name}">
                </p>
                <p>
                  <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
                </form>
                `,
                `<a href="/author/create">author create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
},
exports.update_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        })
    });
},
exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM author WHERE id=?`,[post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        })
    });
}