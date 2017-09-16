open Dsl;

open Matcher;

let exec x => ExampleGroup.empty |> applyOperation x |> run;

exception TestFailed string;

register (
  describe
    "TestContext"
    [
      describe
        "Adding data to context"
        [
          it
            "Makes the data retrievable"
            (
              fun _ => {
                let x = TestContext.create ();
                x |> TestContext.add "x" 42;
                x |> TestContext.get "x" |> should (equal 42)
              }
            )
        ]
    ]
);

register (
  describe
    "More specs"
    [
      it
        "works more"
        (
          fun () => {
            let lines = ref [];
            it "has a test" (fun () => lines := ["x", ...!lines]) |> exec;
            !lines |> should (equal ["x"])
          }
        ),
      it "Works event more" (fun () => Js.log "Function 4"),
      describe "Child specs" [it "Has child spec" (fun () => Js.log "Child spec")]
    ]
);

Js.log "*  Starting test run";

!rootContext |> run;
