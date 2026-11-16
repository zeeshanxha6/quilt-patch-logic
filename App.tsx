/**
 * Quilt Patch Logic — state machine only, no gameplay here (rule #2).
 * loader -> menu -> game -> gameover -> menu, plus the shelf and rules leaves.
 */
import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import ShelfScreen from './src/screens/ShelfScreen';
import RulesScreen from './src/screens/RulesScreen';
import theme from './src/constants/theme';
import {applyResult, createProgress} from './src/game/progress';
import type {GameResult, Progress} from './src/game/progress';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'shelf' | 'rules';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [progress, setProgress] = useState<Progress>(createProgress);
  const [packIndex, setPackIndex] = useState(0);
  const [seed, setSeed] = useState(1);
  const [result, setResult] = useState<GameResult | null>(null);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goShelf = useCallback(() => setScreen('shelf'), []);
  const goRules = useCallback(() => setScreen('rules'), []);

  const startGame = useCallback(() => {
    setSeed(s => s + 1);
    setResult(null);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((res: GameResult) => {
    setProgress(prev => applyResult(prev, res));
    setResult(res);
    setScreen('gameover');
  }, []);

  const handleReset = useCallback(() => {
    setProgress(createProgress());
    setPackIndex(0);
  }, []);

  const quiltNumber = progress.perPack[packIndex] + 1;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          progress={progress}
          packIndex={packIndex}
          onSelectPack={setPackIndex}
          onPlay={startGame}
          onShelf={goShelf}
          onRules={goRules}
          onReset={handleReset}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'game-' + packIndex + '-' + seed}
          packIndex={packIndex}
          quiltNumber={quiltNumber}
          seed={seed}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <GameOverScreen
          result={result}
          progress={progress}
          onPlayAgain={startGame}
          onShelf={goShelf}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'shelf' ? (
        <ShelfScreen progress={progress} onBack={goMenu} onPlay={startGame} />
      ) : null}

      {screen === 'rules' ? (
        <RulesScreen onBack={goMenu} onPlay={startGame} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
});
