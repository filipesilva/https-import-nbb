(ns script
  (:require
   ;; This doesn't work, throws
   ;; (node:79264) UnhandledPromiseRejectionWarning: Error: Cannot find module 'https://cdn.skypack.dev/canvas-confetti'
   ;; Seems to be related to code on nbb.main. Probably could work though.
   #_["https://cdn.skypack.dev/canvas-confetti" :as confetti]))

;; But this does work.
(-> (js/import "https://cdn.skypack.dev/canvas-confetti")
    (.then (fn [confetti]
             (js/console.log confetti))))
