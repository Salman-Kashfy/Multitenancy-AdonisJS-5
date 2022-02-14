const constants = {
    APP_NAME: 'There',
    PER_PAGE: 20,
    ORDER_BY_COLUMN: 'id',
    ORDER_BY_VALUE: 'desc',
    OTP_TTL: 5,
    FCM_KEY: 'your key goes here',
    IMAGE_NOT_FOUND: 'not-found.png',
    USER_NOT_FOUND: 'not-found-user.png',
    SETTINGS: {
        VIDEO_THUMBNAIL: false,
        VIDEO_DURATION: false
    },
    ADMIN_PER_PAGE: 1000,
    IMAGE_RESIZE: {
        MEDIUM: 500,
        SMALL: 100
    },
    UPLOAD_CHANNEL: 's3',
    S3_URL: 'https://there-app.s3.ap-south-1.amazonaws.com/',
    AUTH_TOKEN_EXPIRY: '30days',
    PARK_RADIUS: 50,
    MAIL_FROM_ADDRESS:'developers@tekrevol.com',
    DISTANCE_LIMIT: 6371 // For Miles 3959, For KM, use 6371
}

export default constants