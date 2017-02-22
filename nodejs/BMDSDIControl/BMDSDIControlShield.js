var kSDIControlShield_VersionMajor = 1;
var kSDIControlShield_VersionMinor = 0;

function begin() const
{
	const uint32_t expectedIdentifier = ((uint32_t)'S' << 0 | (uint32_t)'D' << 8 | (uint32_t)'I' << 16 | (uint32_t)'C' << 24);
	while (regRead32(kRegIDENTIFIER) != expectedIdentifier)
	{
		// Wait for shield to become ready, the FPGA takes time to boot up
	}
}

function getLibraryVersion() const
{
	Version libraryVersion;

	libraryVersion.Major = kSDIControlShield_VersionMajor;
	libraryVersion.Minor = kSDIControlShield_VersionMinor;

	return libraryVersion;
}

function getProtocolVersion() const
{
	Version softwareVersion;

	uint16_t version = regRead16(kRegPVERSION);
	softwareVersion.Major = (version & kRegPVERSION_MAJOR_Mask) >> kRegPVERSION_MAJOR_Offset;
	softwareVersion.Minor = (version & kRegPVERSION_MINOR_Mask) >> kRegPVERSION_MINOR_Offset;

	return softwareVersion;
}

function getFirmwareVersion() const
{
	Version hardwareVersion;

	uint16_t version = regRead16(kRegFWVERSION);
	hardwareVersion.Major = (version & kRegFWVERSION_MAJOR_Mask) >> kRegFWVERSION_MAJOR_Offset;
	hardwareVersion.Minor = (version & kRegFWVERSION_MINOR_Mask) >> kRegFWVERSION_MINOR_Offset;

	return hardwareVersion;
}

function setOutputSignalOverride(bool enabled) const
{
	byte regValue = regRead8(kRegCONTROL);

	if (enabled)
		regValue |=  kRegCONTROL_OOVERIDE_Mask;
	else
		regValue &= ~kRegCONTROL_OOVERIDE_Mask;

	regWrite8(kRegCONTROL, regValue);
}

bool SDIControlShield::getOutputSignalOverride() const
{
	return regRead8(kRegCONTROL) & kRegCONTROL_OOVERIDE_Mask;
}
