require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
//var Movie = require('./models/Movie');
var Author = require('./models/Author');
var Article = require('./models/Article');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://ec2-18-220-59-135.us-east-2.compute.amazonaws.com", neo4j.auth.basic("neo4j", "admin"));

/*Function to search all authors who have a keyword in their article title*/
function searchAllArticles(queryString) {
  var session = driver.session();
  return session
    .run(
        'MATCH (article:article)-[:HAS]-(m) WHERE article.title =~ {title} RETURN m',
      {title: '(?i).*' + queryString + '.*'}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
	     console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/*Function to search all authors who have published in a particular conference*/
function searchByConf(queryString) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (:confName { confName: {title}})-[:PUBLISHES]->(n)-[:HAS]->(m) RETURN DISTINCT m',
      {title:   queryString}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/*TODO: Function to find common co uthors for a given author*/
function searchForCoAuth(queryString) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (:author { authorName: {authorName} })-[:CO_AUTHOR]-(m) RETURN DISTINCT m',
      {authorName:   queryString}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}
/*Function to find all common co authors between two authors*/
function searchCommonAuth(author1, author2) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (:author { authorName: {author1} })-[:CO_AUTHOR]-(m) \
      -[:CO_AUTHOR]-(:author { authorName: {author2}}) RETURN DISTINCT m',
      {author1:   author1, author2: author2}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/*Function to find all common co authors with given article count*/
function searchFor10(author, count) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (:author { authorName: {author} })-[r:CO_AUTHOR]-(m) WHERE r.articleCount >= {count} RETURN DISTINCT m',
      {author:   author, count: Number(count)}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}
/*Function to find common authors between two conferences/journals*/
function searchConfAuth(jour1, jour2) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (:confName { confName:{jour1} })-[:PUBLISHES]->(n)-[:HAS]->(m) <-[:HAS]-(t)<-[:PUBLISHES]-(:confName { confName: {jour2} })  RETURN DISTINCT m',
      {jour1:   jour1, jour2: jour2}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Author(record.get('m'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/**ARTICLES API*/
/*Function to find all the articles authored by the given author*/
function searchAuthsArticles(queryString) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (a:article)-[:HAS]->(m) WHERE m.authorName = {authorName} RETURN DISTINCT a',
      {authorName:   queryString}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Article(record.get('a'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/*Function to find all articles cited by the given author in all his articles*/
function searchCitedArticles(queryString) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (a:article)-[:CITES]->(b:article), (a:article)-[:HAS]->(m) WHERE m.authorName = {authorName} RETURN DISTINCT b',
      {authorName:   queryString}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Article(record.get('b'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

/*Function to find all articles that cite the given author*/
function searchAuthsCite(queryString) {
  console.log("running query");
  var session = driver.session();
  return session
    .run(
      'MATCH (a:article)-[:CITES]->(b:article)-[:HAS]->(m) WHERE m.authorName = {authorName} RETURN DISTINCT a',
      {authorName:   queryString}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
      console.log(record);
        return new Article(record.get('a'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}




function getGraph() {
  var session = driver.session();
  return session.run(
    'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
    RETURN m.title AS movie, collect(a.name) AS cast \
    LIMIT {limit}', {limit: 100})
    .then(results => {
      session.close();
      var nodes = [], rels = [], i = 0;
      results.records.forEach(res => {
        nodes.push({title: res.get('movie'), label: 'movie'});
        var target = i;
        i++;

        res.get('cast').forEach(name => {
          var actor = {title: name, label: 'actor'};
          var source = _.findIndex(nodes, actor);
          if (source == -1) {
            nodes.push(actor);
            source = i;
            i++;
          }
          rels.push({source, target})
        })
      });

      return {nodes, links: rels};
    });
}

exports.searchAllArticles = searchAllArticles;
exports.searchByConf = searchByConf;
exports.searchForCoAuth = searchForCoAuth;
exports.searchCommonAuth = searchCommonAuth;
exports.searchConfAuth = searchConfAuth;
////
exports.searchAuthsArticles = searchAuthsArticles;
exports.searchCitedArticles = searchCitedArticles;
exports.searchAuthsCite = searchAuthsCite;
exports.searchFor10 = searchFor10;
exports.getGraph = getGraph;

