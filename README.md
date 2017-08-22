# AuthorGeneologyUI
Front end to the graph database for DBLP data

This serves as the front end to the DBLP graph database hosted on ec2.

<h2> How to run the application </h2>

1. Clone the repo

2. Run npm install

3. Run npm run build

4. Go to directory build and open index.html in the browser

<h2>Queries you can use:</h2>

Queries to search authors:
1. Enter a keyword that appears in an article title to search for all authors who have similar article titles
2. Enter a conference name to find all authors who have published in that conference
3. Enter an author name to find all his/her co-authors
4. Find all co authors who have published more than the given count of articles with the given author
5. Enter two authors to find their common co-authors i.e. authors with whom both the authors have published
6. Enter two conference names to find all common authors

Queries to search articles:
1. Enter an author name to find all his articles
2. Enter an author name to find all articles he has cited
3. Enter an author name to find which articles have cited him/her

<h2>Features of the web app:</h2>

1. Establishes connection to the hosted dblp graph database
2. The search results are sortable alphabetically
