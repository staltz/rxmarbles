#
# App entry-point.
#
Sandbox = require 'rxmarbles/views/sandbox'
OperatorsMenu = require 'rxmarbles/views/operators-menu'
Package = require 'package.json'

sandboxContainer = document.querySelector(".sandbox")
sandboxContainer.appendChild(Sandbox.render())

operatorsMenuContainer = document.querySelector(".operators-menu-container")
operatorsMenuContainer.appendChild(OperatorsMenu.render())

document.querySelector("#app-version").textContent = "v#{Package.version}"
rxVersion = Package.dependencies.rx.replace(/(~|\^|\.\+)*/g, "")
rxElement = document.querySelector("#rxjs-version")
rxElement.textContent = "RxJS v#{rxVersion}"
rxElement.href = "https://github.com/Reactive-Extensions/RxJS/tree/v#{rxVersion}"
