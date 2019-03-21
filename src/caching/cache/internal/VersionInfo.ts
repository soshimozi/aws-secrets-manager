export class VersionInfo {
    // incremented for design changes that break backward compatibility.
    public static VERSION_NUM : String = "1";
    // incremented for major changes to the implementation
    public static MAJOR_REVISION_NUM : String = "1";
    // incremented for minor changes to the implementation
    public static MINOR_REVISION_NUM : String = "0";
    // incremented for releases containing an immediate bug fix.
    public static BUGFIX_REVISION_NUM : String = "0";

    public static RELEASE_VERSION : String = VersionInfo.VERSION_NUM + "." + VersionInfo.MAJOR_REVISION_NUM + "." + VersionInfo.MINOR_REVISION_NUM
            + "." + VersionInfo.BUGFIX_REVISION_NUM;

    public static USER_AGENT : String = "AwsSecretCache-JS/" + VersionInfo.RELEASE_VERSION;  
}