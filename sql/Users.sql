CREATE TABLE Users
(
	Contact VARCHAR(38),
	DOB DateTime,
	Email VARCHAR(38),
	Name VARCHAR(38),
	Password VARCHAR(38),
	UserId Int IDENTITY(1,1) PRIMARY KEY,
	UserName VARCHAR(38)
)	