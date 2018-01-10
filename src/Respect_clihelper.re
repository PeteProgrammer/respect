let runRoot = (callback) =>
  Respect.Runner.runRoot ()
  |> Respect_async.run(
    (result : Respect.Runner.runResult) =>
      if (result.testResult |> Respect.TestResult.isSuccess) {
        Js.log("Test run succeeded");
        callback(0)
      } else {
        Js.log("Test run failed");
        callback(1)
      },
      ~fe=(_) => {
        Js.log("Test run failed");
        callback(1)
      }
  );
