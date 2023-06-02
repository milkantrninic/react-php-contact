<?php

class ContactsAPI {

  private $host = "devkinsta_db"; 
  private $user = "root"; 
  private $password = "y9Q66z79CGQiZid3"; 
  private $dbname = "contact_mang"; 
  protected $con;

  public function __construct() {
    // Create database connection
    $this->con = mysqli_connect($this->host, $this->user, $this->password, $this->dbname);

    // Check connection
    if (!$this->con) {
      die("Connection failed: " . mysqli_connect_error());
    }
  }

  public function run() {
    // Get HTTP method of request
    $method = $_SERVER['REQUEST_METHOD'];

    // Add CORS headers to response
    $this->addCorsHeaders();

    // Switch based on HTTP method
    switch ($method) {
      case 'GET':
        $this->handleGet();
        break;
      case 'POST':
        $this->handlePost();
        break;
      default:
        http_response_code(405); // Method Not Allowed
        break;
    }

    // Close database connection
    $this->con->close();
  }

  private function addCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization");
    header("Access-Control-Expose-Headers: Content-Length,Content-Range");
    header("Access-Control-Allow-Credentials: true");
  }
  //mysqli_query repeates several times in this file. I created this function to be able to reuse it. 
protected function runQuery($sql) {
  // Run SQL statement
  $result = mysqli_query($this->con, $sql);
  if($result ){
    return $result;
  }
  
  // Check if SQL statement failed
  if (!$result) {
    http_response_code(404); // Set HTTP status code to 404
    die(mysqli_error($this->con)); // Output error message
  }

  if (mysqli_num_rows($result) == 0) {
    http_response_code(204); // No Content
    return;
  }
}
//This handles GET request
  private function handleGet() {
    $sql = "SELECT * FROM contacts"; // Select all rows from 'contacts' table

    $result = $this->runQuery($sql);

    $contacts = array();

    // Loop through each row and add to contacts array
    while ($row = mysqli_fetch_assoc($result)) {
      array_push($contacts, $row);
    }

    echo json_encode($contacts); // Output contacts as JSON-encoded array
  }
//This handles POST request
  private function handlePost() {
    // Get data from POST request body
    //$data = json_decode(file_get_contents('php://input'), true);

    $name = isset($_POST["name"]) ? $_POST["name"] : "";
    $email = isset($_POST["email"]) ? $_POST["email"] : "";
    $country = isset($_POST["country"]) ? $_POST["country"] : "";
    $city = isset($_POST["city"]) ? $_POST["city"] : "";
    $job = isset($_POST["job"]) ? $_POST["job"] : "";
    $id = isset($_POST["id"]) ? $_POST["id"] : "";
    $editingId = isset($_POST["editingId"]) ? $_POST["editingId"] : "";
    

    // Insert data into 'contacts' table
    if($id !== "" && $editingId === "") {
      $sql = "DELETE FROM contacts WHERE id=$id";

    } else if ($editingId !== ""){
      $sql = "UPDATE contacts 
      SET  name = '$name',  email = '$email',  city = '$city', country = '$country', job = '$job'
      WHERE id = $editingId;"; 
    }   else {
      $sql = "INSERT INTO contacts (name, email, city, country, job) VALUES ('$name', '$email', '$city', '$country', '$job')"; 
      }
      //This runs query on the DB
      $this->runQuery($sql);
}

}

// Create new ContactsAPI object and run it
$api = new ContactsAPI();
$api->run();