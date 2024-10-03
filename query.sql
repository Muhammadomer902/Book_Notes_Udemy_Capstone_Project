CREATE DATABASE Book_Notes;

CREATE TABLE Books(
	ID SERIAL PRIMARY KEY,
	Book_Title VARCHAR(100) UNIQUE NOT NULL,
	Book_Author VARCHAR(50) NOT NULL,
	Book_Review TEXT,
	Book_Rating INT,
	Date_Read DATE,
	ISBN INT NOT NULL
);

INSERT INTO Books (Book_Title, Book_Author, Book_Review, Book_Rating, Date_Read, ISBN)
VALUES ('You Can Negotiate Anything', 'Herb Cohen', 'Everything is negotiable. Challenge authority. You have the power in any situation. This is how to realize it and use it. A must-read classic from 1980 from a master negotiator. My notes here aren’t enough because the little book is filled with so many memorable stories — examples of great day-to-day moments of negotiation that will stick in your head for when you need them. (I especially loved the one about the power of the prisoner in solitary confinement.) So go buy and read the book. I’m giving it a 10/10 rating even though the second half of the book loses steam, because the first half is so crucial.', 10, '2024-10-03', 806541229);
