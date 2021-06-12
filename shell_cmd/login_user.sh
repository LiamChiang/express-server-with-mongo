curl -d "account=$1&password=$2" -X POST http://127.0.0.1:9000/v1/user/login 
# TOKEN=$(curl -s -X POST -d "account=$1&password=$2" http://127.0.0.1:9000/v1/user/login  | jq -r '.token')
echo \n