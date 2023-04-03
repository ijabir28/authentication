# Authentication Service

### This Authentication Service is built on NodeJs (Express, MySQL)

#### **Authentication API has the following body**
*   first_name
*   last_name
*   email
*   password
*   NID
*   profile photo
*   Age
*   Current marital status
*   auth_token



   **Note Below**
*    Email and Password will be on auth table and the rest are on the profile table
*    Be ensure that, if one table insertion is failed then the other will not insert(ACID
*    properties of DBMS)
*    password should be encrypted with Crypto Library
*    For photo upload you can use Multer Library
*    Store photos in local storage and save the path on table
*    Use a generic response for failed and success individually
*    Success code should be 200
*    You can use `mysql` library for nodejs mysql
