#include <Fuzzy.h>
#include <ArduinoJson.h>

#define DIST_ID 1
#define TEMPERATURE_ID 2



Fuzzy *fuzzy = new Fuzzy();
StaticJsonDocument<200> doc;

// FuzzyInput (cm)
FuzzySet *near = new FuzzySet(0, 0, 40, 60);
FuzzySet *safe = new FuzzySet(60, 80, 80, 100);
FuzzySet *distant = new FuzzySet(90, 120, 262, 262);

// FuzzyInput (Celsius)
FuzzySet *cold = new FuzzySet(-30, -30, -20, 0);
FuzzySet *good = new FuzzySet(-5, 0, 0, 80);
FuzzySet *hot = new FuzzySet(75, 90, 150, 150);

// FuzzyOutput (rpm)
FuzzySet *minimum = new FuzzySet(0, 30, 30, 50);
FuzzySet *average = new FuzzySet(40, 50, 50, 90);
FuzzySet *maximum = new FuzzySet(80, 100, 100, 255);


FuzzyRuleConsequent* motorIsMaximum() {
  FuzzyRuleConsequent *thenMotorIsMaximum = new FuzzyRuleConsequent();
  thenMotorIsMaximum->addOutput(maximum);
  return thenMotorIsMaximum;
}

FuzzyRuleConsequent* motorIsAverage() {
  FuzzyRuleConsequent *thenMotorIsAverage = new FuzzyRuleConsequent();
  thenMotorIsAverage->addOutput(average);
  return thenMotorIsAverage;
}

FuzzyRuleConsequent* motorIsMinimum() {
  FuzzyRuleConsequent *thenMotorIsMinimum = new FuzzyRuleConsequent();
  thenMotorIsMinimum->addOutput(minimum);
  return thenMotorIsMinimum;
}

FuzzyRuleAntecedent* antecedentWithAND(FuzzySet *value1, FuzzySet *value2) {
  FuzzyRuleAntecedent *ifWithAND = new FuzzyRuleAntecedent();
  ifWithAND->joinWithAND(value1, value2);
  return ifWithAND;
}

void setup()
{
  
  Serial.begin(9600);
  delay(3000);
  FuzzyInput *distance = new FuzzyInput(DIST_ID);
  distance->addFuzzySet(near);
  distance->addFuzzySet(safe);
  distance->addFuzzySet(distant);
  fuzzy->addFuzzyInput(distance);

  FuzzyInput *temperature = new FuzzyInput(TEMPERATURE_ID);
  temperature->addFuzzySet(cold);
  temperature->addFuzzySet(good);
  temperature->addFuzzySet(hot);
  fuzzy->addFuzzyInput(temperature);

  // FuzzyOutput
  FuzzyOutput *motor = new FuzzyOutput(1);

  motor->addFuzzySet(minimum);
  motor->addFuzzySet(average);
  motor->addFuzzySet(maximum);
  fuzzy->addFuzzyOutput(motor);

  // Building FuzzyRule

  /*RULE 1*/
  FuzzyRule *fuzzyRule1 = new FuzzyRule(1, antecedentWithAND(distant, cold), motorIsMaximum());
  fuzzy->addFuzzyRule(fuzzyRule1);

  /*RULE 2*/
  FuzzyRule *fuzzyRule2 = new FuzzyRule(2, antecedentWithAND(distant, good), motorIsMaximum());
  fuzzy->addFuzzyRule(fuzzyRule2);

  /*RULE 3*/
  FuzzyRule *fuzzyRule3 = new FuzzyRule(3, antecedentWithAND(distant, hot), motorIsAverage());
  fuzzy->addFuzzyRule(fuzzyRule3);

  /*RULE 4*/
  FuzzyRule *fuzzyRule4 = new FuzzyRule(4, antecedentWithAND(safe, cold), motorIsMaximum());
  fuzzy->addFuzzyRule(fuzzyRule4);

  /*RULE 5*/
  FuzzyRule *fuzzyRule5 = new FuzzyRule(5, antecedentWithAND(safe, good), motorIsAverage());
  fuzzy->addFuzzyRule(fuzzyRule5);

  /*RULE 6*/
  FuzzyRule *fuzzyRule6 = new FuzzyRule(6, antecedentWithAND(safe, hot), motorIsMinimum());
  fuzzy->addFuzzyRule(fuzzyRule6);

  /*RULE 7*/
  FuzzyRule *fuzzyRule7 = new FuzzyRule(7, antecedentWithAND(near, cold), motorIsMaximum());
  fuzzy->addFuzzyRule(fuzzyRule7);

  /*RULE 8*/
  FuzzyRule *fuzzyRule8 = new FuzzyRule(8, antecedentWithAND(near, good), motorIsMinimum());
  fuzzy->addFuzzyRule(fuzzyRule8);

  /*RULE 9*/
  FuzzyRule *fuzzyRule9 = new FuzzyRule(9, antecedentWithAND(near, hot), motorIsMinimum());
  fuzzy->addFuzzyRule(fuzzyRule9);
}

void loop()
{
  int distance = map(analogRead(A0), 0, 1023, 0 , 262); //random(0,262); 
  int temperature = map(analogRead(A1), 0, 1023, -30 , 150);  //random(-30, 150); 


  fuzzy->setInput(DIST_ID, distance);
  fuzzy->setInput(TEMPERATURE_ID, temperature);

  fuzzy->fuzzify();
  
  float output1 = fuzzy->defuzzify(1);

  JsonObject root = doc.to<JsonObject>();

  JsonObject distanceSensor = root.createNestedObject("distanceSensor");
  distanceSensor["Dist"] = distance;
  distanceSensor["Near"] = near->getPertinence();
  distanceSensor["Safe"] = safe->getPertinence();
  distanceSensor["Distant"] = distant->getPertinence();

  JsonObject temperatureSensor = root.createNestedObject("temperatureSensor");
  temperatureSensor["Temp"] = temperature;
  temperatureSensor["Cold"] = cold->getPertinence();
  temperatureSensor["Good"] = good->getPertinence();
  temperatureSensor["Hot"] = hot->getPertinence();

  JsonObject motorInversor = root.createNestedObject("motorInversor");
  motorInversor["Output"] = output1;
  motorInversor["Minimum"] = minimum->getPertinence();
  motorInversor["Average"] = average->getPertinence();
  motorInversor["Maximum"] = maximum->getPertinence();
  
  if(Serial) {
      serializeJson(root, Serial);
  }
  
  delay(3000);
}
