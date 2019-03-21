"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VersionInfo {
}
// incremented for design changes that break backward compatibility.
VersionInfo.VERSION_NUM = "1";
// incremented for major changes to the implementation
VersionInfo.MAJOR_REVISION_NUM = "1";
// incremented for minor changes to the implementation
VersionInfo.MINOR_REVISION_NUM = "0";
// incremented for releases containing an immediate bug fix.
VersionInfo.BUGFIX_REVISION_NUM = "0";
VersionInfo.RELEASE_VERSION = VersionInfo.VERSION_NUM + "." + VersionInfo.MAJOR_REVISION_NUM + "." + VersionInfo.MINOR_REVISION_NUM
    + "." + VersionInfo.BUGFIX_REVISION_NUM;
VersionInfo.USER_AGENT = "AwsSecretCache-JS/" + VersionInfo.RELEASE_VERSION;
exports.VersionInfo = VersionInfo;
//# sourceMappingURL=VersionInfo.js.map