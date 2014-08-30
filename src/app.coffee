#
# App entry-point.
#
Sandbox = require 'rxmarbles/views/sandbox'
OperatorsMenu = require 'rxmarbles/views/operators-menu'
Package = require 'package.json'

sandboxContainer = document.querySelector(".js-sandboxContainer")
sandboxContainer.innerHTML = ""
sandboxContainer.appendChild(Sandbox.render())

operatorsMenuContainer = document.querySelector(".js-operatorsMenuContainer")
operatorsMenuContainer.appendChild(OperatorsMenu.render())

versionElement = document.querySelector("a.js-appVersion")
versionElement.textContent = "v#{Package.version}"
versionElement.href = "https://github.com/staltz/rxmarbles/releases/tag/v#{Package.version}"

rxVersion = Package.dependencies.rx.replace(/(~|\^|\.\+)*/g, "")
rxElement = document.querySelector("a.js-rxjsVersion")
rxElement.textContent = "RxJS v#{rxVersion}"
rxElement.href = "https://github.com/Reactive-Extensions/RxJS/tree/v#{rxVersion}"
