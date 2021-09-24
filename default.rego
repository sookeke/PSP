package trivy

import data.lib.trivy

default ignore = true

ignore_pkgs := {"systemd", "vim"}

ignore_severities := {"LOW", "MEDIUM"}

ignore {
	input.PkgName == ignore_pkgs[_]
}

ignore {
	input.Severity == ignore_severities[_]
}
