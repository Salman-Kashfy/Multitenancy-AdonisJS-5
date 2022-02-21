const constants = {
    APP_NAME: 'Doodl',
    PER_PAGE: 20,
    ORDER_BY_COLUMN: 'id',
    ORDER_BY_VALUE: 'desc',
    OTP_TTL: 5,
    FCM_KEY: 'your key goes here',
    IMAGE_NOT_FOUND: 'not-found.png',
    USER_NOT_FOUND: 'not-found-user.png',
    ADMIN_PER_PAGE: 20,
    IMAGE_RESIZE: {
        MEDIUM: 500,
        SMALL: 100
    },
    UPLOAD_CHANNEL: 's3',
    S3_URL: 'https://there-app.s3.ap-south-1.amazonaws.com/',
    AUTH_TOKEN_EXPIRY: '30days',
    PARK_RADIUS: 50,
    MAIL_FROM_ADDRESS:'developers@tekrevol.com',
    DISTANCE_LIMIT: 6371, // For Miles 3959, For KM, use 6371
    PLAY_STORE_URL: "http://google.com/",
    APPLE_STORE_URL: "https://apple.com/"
}

export default constants