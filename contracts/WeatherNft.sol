// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {FunctionsClient, FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";

contract WeatherNft is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // Error
    error WeatherNft__YouAreNotACat__Meowwwwww();

    struct WeatherRequest {
        string latitude;
        string longitude;
        address user;
    }

    string public sourceCode;           // source code for js which contains the api request methods
    bytes public secrets;

    bytes public successData;
    string public errorData;
    uint64 public subId;
    uint32 public callbackGasLimit;
    bytes32 public donId;
    mapping (bytes32 reqId => WeatherRequest userLocation) public userRequestInfo;
    address public kitty;

    // Events
    event WeatherReported(uint256 indexed currWeather, string indexed latitude, string indexed longitude, address user);
    event WeatherFailed(address indexed user, string indexed error);

    modifier onlyKitty() {
        if (msg.sender != kitty) {
            revert WeatherNft__YouAreNotACat__Meowwwwww();
        }
        _;
    }

    constructor(
        address router, 
        string memory _sourceCode, 
        bytes memory _secrets, 
        uint64 subscriptionId,
        uint32 gasLimit,
        string memory _donId) FunctionsClient(router)
    {
        sourceCode = _sourceCode;
        secrets = _secrets;
        subId = subscriptionId;
        callbackGasLimit = gasLimit;
        donId = bytes32(abi.encodePacked(_donId));
        kitty = msg.sender;
    }

    // Function - User will call the function to request chainlink functions to execute the js file
    // which contains the api request handling and returning and it returns the current weather of that
    // location provided by user in form of latitue and longitude

    function getWeather(string memory latitude, string memory longitude) external {
        FunctionsRequest.Request memory req;
        req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, sourceCode);

        // we need to pass 2 args - latitude and longitude in the form of string
        // create an array for that
        string[] memory args = new string[](3);
        args[0] = latitude;
        args[1] = longitude;
        args[2] = 'metric';

        req.setArgs(args);

        req.addSecretsReference(secrets);

        bytes32 reqId = _sendRequest(
            req.encodeCBOR(),
            subId,
            callbackGasLimit,
            donId
        );

        userRequestInfo[reqId] = WeatherRequest({
            latitude: latitude,
            longitude: longitude,
            user: msg.sender
        });
    }

    function setSourceCode(string memory newCode) external onlyKitty {
        sourceCode = newCode;
    }

    function setSecrets(bytes memory newSecrets) external onlyKitty {
        secrets = newSecrets;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        successData = response;
        errorData = string(err);

        WeatherRequest memory userWeatherRequest = userRequestInfo[requestId];

        if (response.length > 0) {
            uint256 temperature = abi.decode(response, (uint256));

            emit WeatherReported(temperature, userWeatherRequest.latitude, userWeatherRequest.longitude, userWeatherRequest.user);
        }
        else {
            emit WeatherFailed(userWeatherRequest.user, errorData);
        }
    }
}