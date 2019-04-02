(function (angular) {
    angular.module("weblogger")
        .service("UploadsService", function ($http, restUrl) {
            return {
                uploadZipFile: function (file, platform, folder) {
                    return $http({
                        method: 'POST',
                        url: restUrl + 'uploads/zip/platforms',
                        transformRequest: function (data) {
                            var formData = new FormData();
                            formData.append("content", file);
                            return formData;
                        },
                        params: {
                            folder: folder,
                            platform: platform
                        },
                        headers: {'Content-Type': undefined}
                    });
                }
            };
        });
})(angular);