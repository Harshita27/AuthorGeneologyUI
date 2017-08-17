var api = require('./neo4jApi');

$(function () {
  renderGraph();
  //search();

  function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("results");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
  // var el = document.getElementById('#loader');
  $(".buttonload").css("display","none");

  $("#search-article").submit(e => {
    e.preventDefault();
    search();
  });
  $("#search-conf").submit(e => {
    e.preventDefault();
    searchByConf();
  });
  $("#search-coauth").submit(e => {
    e.preventDefault();
    searchForCoAuth();
  });
  
  $("#search-common").submit(e => {
    e.preventDefault();
    searchCommonAuth();
  });

  $("#search-2conf").submit(e => {
    e.preventDefault();
    searchConfAuth();
  });

  // API for article search
  
  $("#search-article-auth").submit(e => {
    e.preventDefault();
    searchAuthsArticles();
  });
  $("#search-cited-auth").submit(e => {
    e.preventDefault();
    searchCitedArticles();
  });
  $("#search-cite-for").submit(e => {
    e.preventDefault();
    searchAuthsCite();
  });
});

function showMovie(title) {
  api
    .getMovie(title)
    .then(movie => {
      if (!movie) return;

      $("#title").text(movie.title);
      $("#poster").attr("src", "http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/" + movie.title + ".jpg");
      var $list = $("#crew").empty();
      movie.cast.forEach(cast => {
        $list.append($("<li>" + cast.name + " " + cast.job + (cast.job == "acted" ? " as " + cast.role : "") + "</li>"));
      });
    }, "json");
}

function simpleTemplating(data) {
    var html = '<tr>';
    $.each(data, function(index, item){
        html += "<td>"+ item.authorName+ "</td><td>"+ item.released +"</td><td>"+ item.tagline +"</td><tr>";
    });
    // html += '</>';
    return html;
}

function search() {
   $(".buttonload").css("display","block");
  
  var query = $("#search-article").find("input[name=search-article]").val();
  api
    .searchAllArticles(query)
    .then(authors => {
      var t = $("table#results tbody").empty();

      $(".buttonload").css("display","none");
      $("#pagination-container").pagination({
        dataSource: authors,
        callback: function(data, pagination) {
            // template method of yourself
            var html = simpleTemplating(data);
             $('table#results tbody').html(html);
          }
        })

      /*if (authors) {
        authors.forEach(author => {
          $("<tr><td class='author'>" + author.authorName + "</td></tr>").appendTo(t)
            .click(function() {
             // showMovie($(this).find("td.movie").text());
            })
        });

      
      }*/
    });
}
function searchByConf() {
  var query = $("#search-conf").find("input[name=search-conf]").val();
  console.log(query);
  api
    .searchByConf(query)
    .then(authors => {
      var t = $("table#results tbody").empty();

      if (authors) {
        authors.forEach(author => {
          $("<tr><td class='author'>" + author.authorName + "</td></tr>").appendTo(t)
            .click(function() {
             // showMovie($(this).find("td.movie").text());
            })
        });

       /* var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}

function searchForCoAuth() {
  var query = $("#search-coauth").find("input[name=search-coauth]").val();
  console.log(query);
  api
    .searchForCoAuth(query)
    .then(authors => {
      var t = $("table#results tbody").empty();

      if (authors) {
        authors.forEach(author => {
          $("<tr><td class='author'>" + author.authorName + "</td></tr>").appendTo(t)
            .click(function() {
             // showMovie($(this).find("td.movie").text());
            })
        });

       /* var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}

function searchCommonAuth() {
  var query1 = $("#search-common").find("input[name=author1]").val();
  var query2 = $("#search-common").find("input[name=author2]").val();
  console.log(query1, query2);
  api
    .searchCommonAuth(query1, query2)
    .then(authors => {
      var t = $("table#results tbody").empty();

      if (authors) {
        authors.forEach(author => {
          $("<tr><td class='author'>" + author.authorName + "</td></tr>").appendTo(t)
            .click(function() {
             // showMovie($(this).find("td.movie").text());
            })
        });

       /* var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}
function searchConfAuth() {
  var query1 = $("#search-2conf").find("input[name=search-conf-1]").val();
  var query2 = $("#search-2conf").find("input[name=search-conf-2]").val();
  console.log(query1, query2);
  api
    .searchConfAuth(query1, query2)
    .then(authors => {
      var t = $("table#results tbody").empty();

      if (authors) {
        authors.forEach(author => {
          $("<tr><td class='author'>" + author.authorName + "</td></tr>").appendTo(t)
            .click(function() {
             // showMovie($(this).find("td.movie").text());
            })
        });

       /* var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}

/*****************ARTICLE API************/

function searchAuthsArticles() {
  var query = $("#search-article-auth").find("input[name=search-article-auth]").val();
  console.log(query);
  api
    .searchAuthsArticles(query)
    .then(articles => {
      var t = $("table#results-article tbody").empty();

      if (articles) {
        articles.forEach(article => {
          $("<tr><td class='article'>" + article.key + "</td><td>"+article.title + "</td><td>"+article.year + "</td></tr>").appendTo(t)
            .click(function() {
              //showMovie($(this).find("td.movie").text());
            })
        });

        /*var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}

function searchCitedArticles() {
   var query = $("#search-cited-auth").find("input[name=search-cited-auth]").val();
  console.log(query);
  api
    .searchCitedArticles(query)
    .then(articles => {
      var t = $("table#results-article tbody").empty();

      if (articles) {
        articles.forEach(article => {
          $("<tr><td class='article'>" + article.key + "</td><td>"+article.title + "</td><td>"+article.year + "</td></tr>").appendTo(t)
            .click(function() {
              //showMovie($(this).find("td.movie").text());
            })
        });

        /*var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}

function searchAuthsCite() {
   var query = $("#search-cite-for").find("input[name=search-cite-for]").val();
  console.log(query);
  api
    .searchAuthsCite(query)
    .then(articles => {
      var t = $("table#results-article tbody").empty();

      if (articles) {
        articles.forEach(article => {
          $("<tr><td class='article'>" + article.key + "</td><td>"+article.title + "</td><td>"+article.year + "</td></tr>").appendTo(t)
            .click(function() {
              //showMovie($(this).find("td.movie").text());
            })
        });

        /*var first = movies[0];
        if (first) {
          showMovie(first.title);
        }*/
      }
    });
}
function renderGraph() {
  var width = 800, height = 800;
  var force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  var svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("pointer-events", "all");

  api
    .getGraph()
    .then(graph => {
      force.nodes(graph.nodes).links(graph.links).start();

      var link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

      var node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
        .attr("class", d => {
          return "node " + d.label
        })
        .attr("r", 10)
        .call(force.drag);

      // html title attribute
      node.append("title")
        .text(d => {
          return d.title;
        });

      // force feed algo ticks
      force.on("tick", () => {
        link.attr("x1", d => {
          return d.source.x;
        }).attr("y1", d => {
          return d.source.y;
        }).attr("x2", d => {
          return d.target.x;
        }).attr("y2", d => {
          return d.target.y;
        });

        node.attr("cx", d => {
          return d.x;
        }).attr("cy", d => {
          return d.y;
        });
      });
    });
}
