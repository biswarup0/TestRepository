var result = {};
/************************************ Setting properties ************************************/
Things["AutoSPC.Dashboard.MashupConfigurationService"].BuildVersion = BuildVersion;
Things["AutoSPC.Dashboard.MashupConfigurationService"].Hostname = Hostname;

result.BUILD_VERION = BuildVersion;
result.HOST_NAME = Hostname;
/************************************ User Groups ************************************/
var groups = ["AutoSPC.Dashboard.Administrators", "AutoSPC.Dashboard.Users"];
var permissionType = "ServiceInvoke";

try {
    /************************************ Add language permissions************************************/
    for (var i = 0; i < groups.length; i++) {
        DataShapes["LanguageDescription"].AddRunTimePermission({
            principal: groups[i] /* STRING */,
            allow: true /* BOOLEAN */,
            resource: "*" /* STRING */,
            type: permissionType /* STRING */,
            principalType: "Group" /* STRING */
        });
    }

    DataShapes["LanguageDescription"].AddVisibilityPermission({
        principal: "AutoSPC.Dashboard.Organization" /* STRING */,
        principalType: "Organization" /* STRING */
    });

    var language = ["Default", "zh-TW", "zh-CN", "tr", "ko", "ja", "ru", "es", "it", "de", "fr"];
    language.forEach(addLanguagePermissions);

    /************************************* Set session usershape**************************************/
    var sessionShapes = Subsystems["UserManagementSubsystem"].GetConfigurationTable({ tableName: 'UserSessionShapes' });

    var params = { fieldName: 'name', isCaseSensitive: true, t: sessionShapes, value: 'AutoSPC.Dashboard.SessionProperties' };
    var dashboardProperties = Resources["InfoTableFunctions"].EQFilter(params);

    if (dashboardProperties.rows.length === 0) {
        result.SESSION_THING_SHAPE = "Adding SESSION ThingShape.";
        Subsystems["UserManagementSubsystem"].AddSessionShape({
            name: "AutoSPC.Dashboard.SessionProperties" /* THINGSHAPENAME */
        });
    }

    /********************************* Add Generic List permissions **********************************/
    for (i = 0; i < groups.length; i++) {
        DataShapes["GenericStringList"].AddRunTimePermission({
            principal: groups[i] /* STRING */,
            allow: true /* BOOLEAN */,
            resource: "*" /* STRING */,
            type: permissionType /* STRING */,
            principalType: "Group" /* STRING */
        });

        DataShapes["PropertyList"].AddRunTimePermission({
            principal: groups[i] /* STRING */,
            allow: true /* BOOLEAN */,
            resource: "*" /* STRING */,
            type: permissionType /* STRING */,
            principalType: "Group" /* STRING */
        });
    }

    DataShapes["GenericStringList"].AddVisibilityPermission({
        principal: "AutoSPC.Dashboard.Organization" /* STRING */,
        principalType: "Organization" /* STRING */
    });

    DataShapes["PropertyList"].AddVisibilityPermission({
        principal: "AutoSPC.Dashboard.Organization" /* STRING */,
        principalType: "Organization" /* STRING */
    });

} catch (err) {
    result.ERROR = "Error message: " + err;
    logger.error("AutoSPC.Dashboard.PostDeploymentConfigurations:" + err);
}


function addLanguagePermissions(item) {
    for (i = 0; i < groups.length; i++) {
        LocalizationTables[item].AddRunTimePermission({
            principal: groups[i] /* STRING */,
            allow: true /* BOOLEAN */,
            resource: "*" /* STRING */,
            type: permissionType /* STRING */,
            principalType: "Group" /* STRING */
        });
    }

    LocalizationTables[item].AddVisibilityPermission({
        principal: "AutoSPC.Dashboard.Organization" /* STRING */,
        principalType: "Organization" /* STRING */
    });
}